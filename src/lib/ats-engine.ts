import {
  buildPlainText,
  filledExperience,
  filledSkills,
  roleYear,
  type CvDoc,
  type Lang,
} from "./cv-model";

export type CheckStatus = "pass" | "warn" | "fail";

export type AtsCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  weight: number;
  detail: string;
};

export type KeywordHit = {
  term: string;
  found: boolean;
};

export type AtsReport = {
  score: number;
  grade: "excellent" | "strong" | "fair" | "weak";
  checks: AtsCheck[];
  keywordHits: KeywordHit[];
  keywordCoverage: number;
  jdCoverage: number | null;
  jdMatched: string[];
  jdMissing: string[];
  parserPreview: string;
  originalScore: number;
};

const ACCOUNTING_KEYWORDS: Record<Lang, string[]> = {
  en: [
    "general ledger",
    "treasury",
    "accounts payable",
    "accounts receivable",
    "payroll",
    "inventory",
    "month-end",
    "reconciliation",
    "trial balance",
    "excel",
    "power query",
    "erp",
    "cost accounting",
    "cash flow",
    "internal control",
    "financial reporting",
    "vat",
    "pricing",
    "chart of accounts",
    "journal",
    "xlookup",
    "pivot",
  ],
  ar: [
    "الأستاذ العام",
    "الخزينة",
    "الحسابات الدائنة",
    "الحسابات المدينة",
    "الرواتب",
    "المخزون",
    "الإقفال الشهري",
    "تسويات",
    "ميزان المراجعة",
    "excel",
    "power query",
    "erp",
    "التكاليف",
    "التدفقات النقدية",
    "الرقابة الداخلية",
    "التقارير المالية",
    "ضريبة القيمة المضافة",
    "دليل الحسابات",
    "القيود",
  ],
};

const STOPWORDS_EN = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "was",
  "were",
  "will",
  "have",
  "has",
  "had",
  "not",
  "but",
  "all",
  "any",
  "our",
  "their",
  "they",
  "who",
  "job",
  "role",
  "work",
  "ability",
  "skills",
  "experience",
  "required",
  "requirements",
  "including",
  "include",
  "plus",
  "must",
  "should",
  "able",
  "using",
  "into",
  "over",
  "under",
  "about",
  "such",
  "other",
  "than",
  "also",
  "well",
  "good",
  "strong",
  "team",
  "years",
  "hiring",
  "hire",
  "looking",
  "candidate",
  "position",
  "responsibilities",
  "prepare",
  "own",
  "full",
  "close",
  "working",
  "pressure",
  "across",
  "within",
  "through",
  "support",
  "supports",
  "make",
  "making",
  "decision",
]);

const STOPWORDS_AR = new Set([
  "في",
  "من",
  "على",
  "إلى",
  "عن",
  "مع",
  "هذا",
  "هذه",
  "ذلك",
  "التي",
  "الذي",
  "أو",
  "و",
  "أن",
  "إن",
  "كان",
  "يكون",
  "يتم",
  "مطلوب",
  "وظيفة",
  "خبرة",
  "لديه",
  "لديك",
  "القدرة",
  "العمل",
  "شركة",
  "بين",
  "بعد",
  "قبل",
  "خلال",
  "حيث",
  "كما",
  "بما",
  "عند",
  "حتى",
]);

export const SAMPLE_JOBS: Record<Lang, { id: string; title: string; text: string }[]> = {
  ar: [
    {
      id: "fin-acc",
      title: "محاسب مالي",
      text: "مطلوب محاسب مالي لإدارة الدورة المحاسبية الكاملة بما يشمل الأستاذ العام، الخزينة، الحسابات الدائنة والمدينة، الرواتب، المخزون، والإقفال الشهري. إعداد تسويات الحسابات وميزان المراجعة والتقارير المالية. خبرة في Excel المتقدم وPower Query وPower BI وOdoo ERP. القدرة على تحليل التكاليف والرقابة الداخلية والعمل تحت الضغط.",
    },
    {
      id: "cost",
      title: "محاسب تكاليف",
      text: "محاسب تكاليف لمتابعة تكلفة الإنتاج، توزيع المصروفات على مراكز التكلفة، مراجعة حركة المخزون، وتحليل هامش الربحية. خبرة في التصنيع، التسعير، المشتريات، والتقارير الإدارية. استخدام Excel وERP وPower BI.",
    },
    {
      id: "payroll",
      title: "محاسب رواتب",
      text: "محاسب رواتب لمراجعة كشوف الرواتب، الاستحقاقات والخصومات، الحضور والانصراف، وصرف الرواتب في المواعيد المحددة. متابعة التسويات الشهرية والحسابات الدائنة. إتقان Excel وأنظمة ERP.",
    },
  ],
  en: [
    {
      id: "fin-acc",
      title: "Financial Accountant",
      text: "We are hiring a Financial Accountant to own the full accounting cycle including General Ledger, Treasury, Accounts Payable, Accounts Receivable, payroll, inventory, and month-end close. Prepare account reconciliations, trial balance, and financial reports. Advanced Excel, Power Query, Power BI, and Odoo ERP required. Experience in cost analysis, internal controls, and working under pressure.",
    },
    {
      id: "cost",
      title: "Cost Accountant",
      text: "Cost Accountant to track production costing, allocate expenses to cost centers, review inventory movement, and analyze profit margins. Manufacturing, pricing, procurement, and management reporting experience. Excel, ERP, and Power BI.",
    },
    {
      id: "payroll",
      title: "Payroll Accountant",
      text: "Payroll Accountant to review payroll files, entitlements and deductions, attendance, and on-time salary payment. Monthly settlements and accounts payable follow-up. Strong Excel and ERP systems.",
    },
  ],
};

const CHECK_COPY: Record<
  Lang,
  Record<string, { label: string; pass: string; fail: string; warn?: string }>
> = {
  ar: {
    column: {
      label: "عمود واحد بدون جداول",
      pass: "التخطيط عمود واحد قابل للقراءة من أنظمة ATS. النسخة الأصلية كانت بعمودين وهذا يخلط النص.",
      fail: "التخطيط متعدد الأعمدة أو يحتوي جداول.",
    },
    headings: {
      label: "عناوين أقسام قياسية",
      pass: "العناوين قياسية: ملخص، خبرات، تعليم، مهارات، لغات.",
      fail: "العناوين غير قياسية وقد تتجاهلها الأنظمة.",
    },
    contact: {
      label: "بيانات التواصل داخل النص",
      pass: "البريد والهاتف والموقع مكتوبة كنص في رأس السيرة وليس داخل صورة أو تذييل.",
      fail: "بيانات التواصل ناقصة أو داخل صورة.",
    },
    dates: {
      label: "تواريخ واضحة بترتيب زمني عكسي",
      pass: "كل وظيفة لها سنة بداية ونهاية، مرتبة من الأحدث للأقدم.",
      fail: "تواريخ ناقصة أو ترتيب غير زمني.",
    },
    skills_text: {
      label: "مهارات كنص وليس أشرطة",
      pass: "المهارات مكتوبة كنص يمكن فهرسته. أشرطة المستوى في النسخة الأصلية لا تُقرأ.",
      fail: "المهارات معروضة كرسوم أو أشرطة فقط.",
    },
    quantified: {
      label: "إنجازات رقمية",
      pass: "يوجد إنجازات مرقمة داخل بنود الخبرة.",
      warn: "أضف أرقامًا (قيمة، عدد، نسبة) لتقوية الأثر.",
      fail: "لا توجد أرقام قابلة للقياس في البنود.",
    },
    keywords: {
      label: "كلمات مفتاحية للمجال",
      pass: "كلمات المجال ظاهرة في النص ويمكن فهرستها.",
      fail: "كلمات المجال ضعيفة — أضف مصطلحات الوظيفة في الملخص والمهارات.",
      warn: "تغطية الكلمات جيدة مع بعض الفجوات.",
    },
    length: {
      label: "طول مناسب (صفحة إلى صفحتين)",
      pass: "الطول مناسب لأنظمة التتبع ومديري التوظيف.",
      fail: "السيرة قصيرة جدًا أو أطول من اللازم.",
    },
    no_photo: {
      label: "بدون صورة شخصية",
      pass: "لا توجد صورة — أفضل لـ ATS ولتجنب التحيز.",
      fail: "وجود صورة يربك بعض الأنظمة.",
    },
    verbs: {
      label: "أفعال إنجاز واضحة",
      pass: "البنود تبدأ بأفعال تشغيلية: إدارة، مراجعة، إعداد، متابعة.",
      fail: "البنود وصفية بدون أفعال إنجاز.",
    },
  },
  en: {
    column: {
      label: "Single column, no tables",
      pass: "Single-column layout that ATS parsers can read in order. The original two-column file would scramble the text.",
      fail: "Multi-column or table layout.",
    },
    headings: {
      label: "Standard section headings",
      pass: "Standard headings: Summary, Experience, Education, Skills, Languages.",
      fail: "Non-standard headings that parsers may skip.",
    },
    contact: {
      label: "Contact details as real text",
      pass: "Email, phone, and location sit in the document body, not in an image or footer.",
      fail: "Contact details missing or embedded in an image.",
    },
    dates: {
      label: "Clear reverse-chronological dates",
      pass: "Every role has a start and end year, newest first.",
      fail: "Missing dates or mixed order.",
    },
    skills_text: {
      label: "Skills as text, not bars",
      pass: "Skills are written as text so they can be indexed. Graphic skill bars in the original are invisible to ATS.",
      fail: "Skills shown only as graphics.",
    },
    quantified: {
      label: "Quantified achievements",
      pass: "Measurable results are present in the bullets.",
      warn: "Add numbers (value, count, percent) to strengthen impact.",
      fail: "No measurable numbers in the bullets.",
    },
    keywords: {
      label: "Field keywords",
      pass: "Field terms appear in the text and can be indexed.",
      fail: "Field keyword coverage is weak — add job terms in the summary and skills.",
      warn: "Good coverage with a few gaps.",
    },
    length: {
      label: "Length (1–2 pages)",
      pass: "Length is appropriate for ATS and recruiters.",
      fail: "Resume is too short or too long.",
    },
    no_photo: {
      label: "No photo",
      pass: "No headshot — better for ATS and bias-safe screening.",
      fail: "A photo can break some parsers.",
    },
    verbs: {
      label: "Action-led bullets",
      pass: "Bullets start with operating verbs: manage, review, prepare, track.",
      fail: "Bullets are descriptive without action verbs.",
    },
  },
};

export function runAts(cv: CvDoc, jobDescription = ""): AtsReport {
  const lang = cv.lang;
  const text = buildPlainText(cv);
  const lower = text.toLowerCase();
  const copy = CHECK_COPY[lang];
  const roles = filledExperience(cv);
  const skills = filledSkills(cv);

  const emailOk = /@/.test(cv.profile.email);
  const phoneOk = /\+?\d[\d\s]{8,}/.test(cv.profile.phone);
  const numberedBullets = roles.flatMap((r) => r.bullets).filter((b) => /\d/.test(b)).length;
  const keywordList = ACCOUNTING_KEYWORDS[lang];
  const keywordHits: KeywordHit[] = keywordList.map((term) => ({
    term,
    found: lower.includes(term.toLowerCase()),
  }));
  const foundCount = keywordHits.filter((k) => k.found).length;
  const keywordCoverage = keywordList.length
    ? Math.round((foundCount / keywordList.length) * 100)
    : 0;

  const datesOk = roles.length > 0 && roles.every((r) => r.start && r.end);
  const reverseOk =
    roles.length === 0 || (roleYear(roles[roles.length - 1]) || 0) <= (roleYear(roles[0]) || 9999);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lengthOk = wordCount >= 250 && wordCount <= 1400;

  const verbHints =
    lang === "ar"
      ? ["إدارة", "مراجعة", "إعداد", "متابعة", "تسجيل", "تأسيس", "تحليل", "تنظيم"]
      : ["manage", "review", "prepare", "track", "record", "found", "analy", "lead"];
  const verbHits = verbHints.filter((v) => lower.includes(v.toLowerCase())).length;

  const checks: AtsCheck[] = [
    makeCheck("column", copy.column, "pass", 14),
    makeCheck("headings", copy.headings, "pass", 12),
    makeCheck(
      "contact",
      copy.contact,
      emailOk && phoneOk && cv.profile.location.trim() ? "pass" : "fail",
      10,
    ),
    makeCheck("dates", copy.dates, datesOk && reverseOk ? "pass" : "fail", 10),
    makeCheck(
      "skills_text",
      copy.skills_text,
      skills.length >= 5 ? "pass" : skills.length >= 2 ? "warn" : "fail",
      10,
    ),
    makeCheck(
      "quantified",
      copy.quantified,
      numberedBullets >= 4 ? "pass" : numberedBullets >= 2 ? "warn" : "fail",
      12,
    ),
    makeCheck(
      "keywords",
      copy.keywords,
      keywordCoverage >= 50 ? "pass" : keywordCoverage >= 25 ? "warn" : "fail",
      12,
    ),
    makeCheck("length", copy.length, lengthOk ? "pass" : "warn", 8),
    makeCheck("no_photo", copy.no_photo, "pass", 6),
    makeCheck("verbs", copy.verbs, verbHits >= 4 ? "pass" : "warn", 6),
  ];

  const score = scoreChecks(checks);

  let jdCoverage: number | null = null;
  let jdMatched: string[] = [];
  let jdMissing: string[] = [];
  const jd = jobDescription.trim();
  if (jd) {
    const terms = extractJdTerms(jd, lang);
    const cvHaystack = lower + " " + cv.summary.toLowerCase();
    for (const term of terms) {
      if (cvHaystack.includes(term.toLowerCase())) jdMatched.push(term);
      else jdMissing.push(term);
    }
    jdCoverage = terms.length ? Math.round((jdMatched.length / terms.length) * 100) : 0;
  }

  return {
    score,
    grade: score >= 90 ? "excellent" : score >= 75 ? "strong" : score >= 55 ? "fair" : "weak",
    checks,
    keywordHits,
    keywordCoverage,
    jdCoverage,
    jdMatched,
    jdMissing,
    parserPreview:
      text ||
      (lang === "ar"
        ? "أضف بيانات السيرة ليظهر النص الذي يقرأه النظام."
        : "Add resume content to see parser text."),
    originalScore: 41,
  };
}

function makeCheck(
  id: string,
  copy: { label: string; pass: string; fail: string; warn?: string },
  status: CheckStatus,
  weight: number,
): AtsCheck {
  const detail = status === "pass" ? copy.pass : status === "warn" ? (copy.warn ?? copy.pass) : copy.fail;
  return { id, label: copy.label, status, weight, detail };
}

function scoreChecks(checks: AtsCheck[]): number {
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const earned = checks.reduce((n, c) => {
    const factor = c.status === "pass" ? 1 : c.status === "warn" ? 0.55 : 0;
    return n + c.weight * factor;
  }, 0);
  return Math.round((earned / totalWeight) * 100);
}

function extractJdTerms(jd: string, lang: Lang): string[] {
  const known = ACCOUNTING_KEYWORDS[lang];
  const foundKnown = known.filter((k) => jd.toLowerCase().includes(k.toLowerCase()));
  const extras = tokenize(jd, lang)
    .filter((t) => t.length >= 5)
    .filter((t) => isSkillLike(t))
    .filter((t) => !foundKnown.some((k) => k.toLowerCase().includes(t) || t.includes(k.toLowerCase())))
    .slice(0, 8);
  return unique([...foundKnown, ...extras]).slice(0, 18);
}

const SKILL_HINTS = new Set([
  "ifrs",
  "gaap",
  "sap",
  "oracle",
  "quickbooks",
  "tally",
  "hyperion",
  "netsuite",
  "dynamics",
  "python",
  "budget",
  "forecast",
  "audit",
  "vat",
  "costing",
  "reconciliation",
  "reconciliations",
  "payroll",
  "treasury",
  "inventory",
  "odoo",
  "excel",
  "tableau",
]);

function isSkillLike(token: string): boolean {
  if (SKILL_HINTS.has(token)) return true;
  if (/\d/.test(token)) return false;
  return token.length >= 7 && !token.endsWith("ing") && !token.endsWith("ed");
}

function tokenize(text: string, lang: Lang): string[] {
  const parts = text
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#]+/u)
    .map((t) => t.trim())
    .filter(Boolean);
  const stop = lang === "ar" ? STOPWORDS_AR : STOPWORDS_EN;
  const counts = new Map<string, number>();
  for (const p of parts) {
    if (stop.has(p) || /^\d+$/.test(p) || p.length < 4) continue;
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

function unique(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

