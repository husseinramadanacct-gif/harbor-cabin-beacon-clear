import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Download, FileDown, LoaderCircle, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/copy";
import type { CvDoc, Lang } from "@/lib/cv-model";
import { cn } from "@/lib/utils";

type PdfFormatId = "a4" | "letter" | "strict";

type Status = "idle" | "busy" | "done" | "error";

export function PdfExportButton({ cv, uiLang }: { cv: CvDoc; uiLang: Lang }) {
  const copy = t(uiLang);
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          void import("@/lib/pdf-build");
          if (cv.lang === "ar") {
            void fetch("/fonts/IBMPlexSansArabic-Regular.ttf");
            void fetch("/fonts/IBMPlexSansArabic-SemiBold.ttf");
          }
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button type="button" size="sm">
          <FileDown />
          {copy.printPdf}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="no-print fixed inset-0 z-40 bg-ink/45" />
        <Dialog.Content
          className={cn(
            "no-print fixed inset-x-0 bottom-0 z-50 max-h-dvh overflow-y-auto rounded-t-xl bg-bg-elevated p-5 shadow-paper",
            "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-base font-semibold text-ink">{copy.pdfTitle}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted">
                {copy.pdfSubtitle}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" aria-label={copy.pdfClose}>
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <PdfFormatList cv={cv} uiLang={uiLang} className="mt-4" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
              <Printer />
              {copy.pdfPrint}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PdfFormatList({
  cv,
  uiLang,
  className,
}: {
  cv: CvDoc;
  uiLang: Lang;
  className?: string;
}) {
  const copy = t(uiLang);
  const [status, setStatus] = useState<Record<PdfFormatId, Status>>({
    a4: "idle",
    letter: "idle",
    strict: "idle",
  });

  async function onDownload(id: PdfFormatId) {
    setStatus((prev) => ({ ...prev, [id]: "busy" }));
    try {
      const { buildCvPdf, downloadPdf, pdfFilename } = await import("@/lib/pdf-build");
      const bytes = await buildCvPdf(cv, id);
      downloadPdf(bytes, pdfFilename(cv, id));
      setStatus((prev) => ({ ...prev, [id]: "done" }));
      window.setTimeout(() => {
        setStatus((prev) => ({ ...prev, [id]: prev[id] === "done" ? "idle" : prev[id] }));
      }, 1800);
    } catch {
      setStatus((prev) => ({ ...prev, [id]: "error" }));
    }
  }

  const cards: {
    id: PdfFormatId;
    title: string;
    body: string;
    meta: string;
    recommended: boolean;
  }[] = [
    {
      id: "a4",
      title: copy.pdfA4Title,
      body: copy.pdfA4Body,
      meta: copy.pdfA4Meta,
      recommended: cv.lang === "ar",
    },
    {
      id: "letter",
      title: copy.pdfLetterTitle,
      body: copy.pdfLetterBody,
      meta: copy.pdfLetterMeta,
      recommended: cv.lang === "en",
    },
    {
      id: "strict",
      title: copy.pdfStrictTitle,
      body: copy.pdfStrictBody,
      meta: copy.pdfStrictMeta,
      recommended: false,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {cards.map((card) => {
        const state = status[card.id];
        return (
          <article
            key={card.id}
            className={cn(
              "rounded-md border bg-paper p-4",
              card.recommended ? "border-accent" : "border-line",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink">{card.title}</h3>
                  {card.recommended ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                      {copy.pdfRecommended}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{card.body}</p>
                <p className="mt-2 text-xs text-subtle">{card.meta}</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3"
              variant={card.recommended ? "default" : "outline"}
              disabled={state === "busy"}
              onClick={() => void onDownload(card.id)}
            >
              {state === "busy" ? (
                <LoaderCircle className="animate-spin" />
              ) : state === "done" ? (
                <Check />
              ) : (
                <Download />
              )}
              {state === "busy"
                ? copy.pdfDownloading
                : state === "done"
                  ? copy.pdfDone
                  : state === "error"
                    ? copy.pdfError
                    : copy.pdfDownload}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
