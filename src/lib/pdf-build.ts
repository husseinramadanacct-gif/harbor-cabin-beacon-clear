import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import * as fontkitNs from "@pdf-lib/fontkit";
import reshaper from "arabic-persian-reshaper";
import bidiFactory from "bidi-js";
import {
  HEADINGS,
  contactLine,
  dateRange,
  fileStem,
  filledEducation,
  filledExperience,
  filledLanguages,
  filledLines,
  type CvDoc,
  type Lang,
} from "./cv-model";

export type PdfFormatId = "a4" | "letter" | "strict";

export type PdfFormat = {
  id: PdfFormatId;
  page: "A4" | "Letter";
  strict: boolean;
};

const bidi = bidiFactory();
const { ArabicShaper } = reshaper;

const A4: [number, number] = [595.28, 841.89];
const LETTER: [number, number] = [612, 792];

const INK = rgb(0.11, 0.098, 0.09);
const MUTED = rgb(0.361, 0.341, 0.31);
const ACCENT = rgb(0.122, 0.42, 0.388);
const BLACK = rgb(0.07, 0.07, 0.07);

export function resolveFormat(lang: Lang, id: PdfFormatId): PdfFormat {
  if (id === "strict") {
    return { id, page: lang === "en" ? "Letter" : "A4", strict: true };
  }
  return { id, page: id === "letter" ? "Letter" : "A4", strict: false };
}

export function pdfFilename(cv: CvDoc, id: PdfFormatId): string {
  const langTag = cv.lang === "ar" ? "AR" : "EN";
  const formatTag = id === "strict" ? "Strict" : id === "letter" ? "US-Letter" : "A4";
  return `${fileStem(cv)}_${langTag}_${formatTag}.pdf`;
}

export async function buildCvPdf(cv: CvDoc, formatId: PdfFormatId): Promise<Uint8Array> {
  const lang = cv.lang;
  const format = resolveFormat(lang, formatId);
  const rtl = lang === "ar";
  const pageSize = format.page === "Letter" ? LETTER : A4;
  const ink = format.strict ? BLACK : INK;
  const muted = format.strict ? rgb(0.22, 0.22, 0.22) : MUTED;
  const accent = format.strict ? BLACK : ACCENT;
  const bullet = format.strict ? "-" : "•";
  const headings = HEADINGS[lang];

  const pdf = await PDFDocument.create();
  const fontkit = (fontkitNs as { default?: unknown }).default ?? fontkitNs;
  pdf.registerFontkit(fontkit as never);
  pdf.setTitle(`${cv.profile.name || "Resume"} — ${cv.profile.headline || "ATS"}`);
  pdf.setAuthor(cv.profile.name || "ATS CV Studio");
  pdf.setSubject("ATS Resume");
  pdf.setKeywords(
    [cv.profile.headline, ...cv.skillGroups.flatMap((group) => group.items)]
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12),
  );
  pdf.setCreator("ATS CV Studio");
  pdf.setProducer("ATS CV Studio");
  pdf.setLanguage(lang === "ar" ? "ar-EG" : "en-US");
  pdf.setCreationDate(new Date());
  pdf.setModificationDate(new Date());

  let regular: PDFFont;
  let bold: PDFFont;
  if (rtl) {
    const [regBytes, boldBytes] = await Promise.all([
      loadFont("IBMPlexSansArabic-Regular.ttf"),
      loadFont("IBMPlexSansArabic-SemiBold.ttf"),
    ]);
    regular = await pdf.embedFont(regBytes, { subset: true });
    bold = await pdf.embedFont(boldBytes, { subset: true });
  } else {
    regular = await pdf.embedFont(StandardFonts.Helvetica);
    bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  }

  const marginX = format.page === "Letter" ? 50 : 46;
  const marginTop = 44;
  const marginBottom = 48;
  const bodySize = 10;
  const bodyLead = 13;
  const ctx: DrawCtx = {
    pdf,
    page: pdf.addPage(pageSize),
    pageSize,
    rtl,
    marginX,
    marginTop,
    marginBottom,
    y: pageSize[1] - marginTop,
    regular,
    bold,
    ink,
    muted,
    accent,
    bodySize,
    bodyLead,
    showRules: !format.strict,
    bullet,
  };

  drawHeader(ctx, cv);
  if (cv.summary.trim()) {
    section(ctx, headings.summary, () => {
      paragraph(ctx, cv.summary.trim());
    });
  }
  const roles = filledExperience(cv);
  if (roles.length) {
    section(ctx, headings.experience, () => {
      roles.forEach((role, index) => {
        const title = [role.title, role.company].filter(Boolean).join(" — ");
        const line = dateRange(role) ? `${title}  ·  ${dateRange(role)}` : title;
        const titleLines = wrap(line, contentWidth(ctx), ctx.bold, 10.5, ctx.rtl);
        const firstBullet = role.bullets[0] ?? "";
        const firstBulletLines = firstBullet
          ? wrap(firstBullet, contentWidth(ctx) - 14, ctx.regular, ctx.bodySize, ctx.rtl)
          : [];
        ensure(ctx, titleLines.length * 13.5 + 4 + firstBulletLines.length * ctx.bodyLead);
        titleLines.forEach((textLine) => {
          lineText(ctx, textLine, ctx.bold, 10.5, ctx.ink, 13.5);
        });
        ctx.y -= 2;
        for (const item of role.bullets) {
          bulletLine(ctx, item);
        }
        if (index < roles.length - 1) ctx.y -= 8;
      });
    });
  }
  const education = filledEducation(cv);
  if (education.length) {
    section(ctx, headings.education, () => {
      for (const item of education) {
        paragraph(ctx, [item.degree, item.school, item.year].filter(Boolean).join("  ·  "), ctx.regular);
      }
    });
  }
  const groups = cv.skillGroups.filter((group) => group.items.some((item) => item.trim()));
  if (groups.length) {
    section(ctx, headings.skills, () => {
      for (const group of groups) {
        const items = group.items.map((item) => item.trim()).filter(Boolean);
        paragraph(ctx, group.title ? `${group.title}: ${items.join("  ·  ")}` : items.join("  ·  "), ctx.regular);
      }
    });
  }
  const langs = filledLanguages(cv);
  if (langs.length) {
    section(ctx, headings.languages, () => {
      paragraph(
        ctx,
        langs.map((item) => (item.level ? `${item.name} (${item.level})` : item.name)).join("  ·  "),
      );
    });
  }
  const training = filledLines(cv.training);
  if (training.length) {
    section(ctx, headings.training, () => {
      paragraph(ctx, training.join("  ·  "));
    });
  }
  const interests = filledLines(cv.interests);
  if (interests.length) {
    section(ctx, headings.interests, () => {
      paragraph(ctx, interests.join("  ·  "));
    });
  }

  return pdf.save({ useObjectStreams: false });
}

type DrawCtx = {
  pdf: PDFDocument;
  page: PDFPage;
  pageSize: [number, number];
  rtl: boolean;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  y: number;
  regular: PDFFont;
  bold: PDFFont;
  ink: RGB;
  muted: RGB;
  accent: RGB;
  bodySize: number;
  bodyLead: number;
  showRules: boolean;
  bullet: string;
};

function contentWidth(ctx: DrawCtx) {
  return ctx.pageSize[0] - ctx.marginX * 2;
}

function newPage(ctx: DrawCtx) {
  ctx.page = ctx.pdf.addPage(ctx.pageSize);
  ctx.y = ctx.pageSize[1] - ctx.marginTop;
}

function ensure(ctx: DrawCtx, needed: number) {
  if (ctx.y - needed < ctx.marginBottom) newPage(ctx);
}

function drawHeader(ctx: DrawCtx, cv: CvDoc) {
  const name = cv.profile.name || (cv.lang === "ar" ? "اسمك هنا" : "Your name");
  const headline = cv.profile.headline;
  const contact = contactLine(cv);
  const nameLines = wrap(name, contentWidth(ctx), ctx.bold, 18, ctx.rtl);
  const headLines = headline.trim() ? wrap(headline, contentWidth(ctx), ctx.regular, 11, ctx.rtl) : [];
  const contactLines = contact ? wrap(contact, contentWidth(ctx), ctx.regular, 9.5, ctx.rtl) : [];
  ensure(ctx, nameLines.length * 22 + headLines.length * 14 + contactLines.length * 12 + 16);
  nameLines.forEach((line) => lineText(ctx, line, ctx.bold, 18, ctx.ink, 22));
  ctx.y -= 2;
  headLines.forEach((line) => lineText(ctx, line, ctx.regular, 11, ctx.accent, 14));
  ctx.y -= 2;
  contactLines.forEach((line) => lineText(ctx, line, ctx.regular, 9.5, ctx.muted, 12.5));
  ctx.y -= 12;
}

function section(ctx: DrawCtx, title: string, body: () => void) {
  const headingSize = 10;
  ensure(ctx, 13 + 10 + ctx.bodyLead * 2);
  lineText(ctx, title, ctx.bold, headingSize, ctx.accent, 13);
  if (ctx.showRules) {
    const y = ctx.y + 2;
    const x1 = ctx.marginX;
    const x2 = ctx.pageSize[0] - ctx.marginX;
    ctx.page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness: 1.15,
      color: ctx.accent,
      opacity: 0.9,
    });
    ctx.y -= 8;
  } else {
    ctx.y -= 4;
  }
  body();
  ctx.y -= 10;
}

function paragraph(ctx: DrawCtx, text: string, font = ctx.regular) {
  const lines = wrap(text, contentWidth(ctx), font, ctx.bodySize, ctx.rtl);
  for (const line of lines) {
    ensure(ctx, ctx.bodyLead);
    lineText(ctx, line, font, ctx.bodySize, ctx.ink, ctx.bodyLead);
  }
}

function bulletLine(ctx: DrawCtx, text: string) {
  const indent = 14;
  const max = contentWidth(ctx) - indent;
  const lines = wrap(text, max, ctx.regular, ctx.bodySize, ctx.rtl);
  ensure(ctx, lines.length * ctx.bodyLead);
  lines.forEach((line, index) => {
    if (index === 0) {
      drawPlain(ctx, ctx.bullet, ctx.regular, ctx.bodySize, ctx.ink, 0);
    }
    drawPlain(ctx, line, ctx.regular, ctx.bodySize, ctx.ink, indent);
    ctx.y -= ctx.bodyLead;
  });
}

function lineText(ctx: DrawCtx, text: string, font: PDFFont, size: number, color: RGB, lead: number) {
  drawPlain(ctx, text, font, size, color, 0);
  ctx.y -= lead;
}

function drawPlain(ctx: DrawCtx, text: string, font: PDFFont, size: number, color: RGB, indent: number) {
  if (!text) return;
  const max = contentWidth(ctx) - indent;
  const layout = layoutRuns(text, ctx.rtl, font, size);
  const origin = ctx.rtl
    ? ctx.pageSize[0] - ctx.marginX - indent - Math.min(layout.width, max)
    : ctx.marginX + indent;
  for (const run of layout.runs) {
    ctx.page.drawText(run.text, {
      x: origin + run.x,
      y: ctx.y,
      size,
      font,
      color,
    });
  }
}

function wrap(logical: string, maxWidth: number, font: PDFFont, size: number, rtl: boolean): string[] {
  const measure = (value: string) => layoutRuns(value, rtl, font, size).width;
  const words = logical.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = "";

  const splitLong = (word: string) => {
    let chunk = "";
    for (const ch of [...word]) {
      const trial = chunk + ch;
      if (chunk && measure(trial) > maxWidth) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk = trial;
      }
    }
    return chunk;
  };

  for (const word of words) {
    if (measure(word) > maxWidth) {
      if (current) {
        lines.push(current);
        current = "";
      }
      current = splitLong(word);
      continue;
    }
    const trial = current ? `${current} ${word}` : word;
    if (measure(trial) <= maxWidth) current = trial;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

type GlyphRun = { text: string; x: number };

function layoutRuns(logical: string, rtl: boolean, font: PDFFont, size: number): { runs: GlyphRun[]; width: number } {
  if (!logical) return { runs: [], width: 0 };
  if (!rtl) {
    return { runs: [{ text: logical, x: 0 }], width: font.widthOfTextAtSize(logical, size) };
  }

  const prepared = ArabicShaper.convertArabic(logical);
  const chars = [...prepared];
  const embedding = bidi.getEmbeddingLevels(prepared, "rtl");
  const mirrored = bidi.getMirroredCharactersMap(prepared, embedding.levels);
  const display = chars.map((ch, index) => mirrored.get(index) ?? ch);
  const order = bidi.getReorderedIndices(prepared, embedding);
  const widths = display.map((ch) => font.widthOfTextAtSize(ch, size));
  const visualX = new Array<number>(display.length);
  let cursor = 0;
  for (const logicalIndex of order) {
    visualX[logicalIndex] = cursor;
    cursor += widths[logicalIndex];
  }

  const runs: GlyphRun[] = [];
  let i = 0;
  while (i < display.length) {
    const start = i;
    let endX = visualX[i] + widths[i];
    i += 1;
    while (i < display.length && Math.abs(visualX[i] - endX) < 0.05) {
      endX += widths[i];
      i += 1;
    }
    runs.push({ text: display.slice(start, i).join(""), x: visualX[start] });
  }
  return { runs, width: cursor };
}

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const res = await fetch(`/fonts/${filename}`);
  if (!res.ok) throw new Error(`Missing font ${filename}`);
  return res.arrayBuffer();
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
