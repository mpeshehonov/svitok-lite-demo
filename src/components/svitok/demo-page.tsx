"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { CtaSection } from "@/components/svitok/cta-section";
import { DocumentSelector } from "@/components/svitok/document-selector";
import { FilePreview } from "@/components/svitok/file-preview";
import { ProcessingAnimation } from "@/components/svitok/processing-animation";
import { ResultView } from "@/components/svitok/result-view";
import { documents } from "@/data/documents";
import { useDocumentProcessing } from "@/hooks/use-document-processing";

export function DemoPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { phase, progress, currentStep, startProcessing, reset } = useDocumentProcessing();

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedId) ?? null,
    [selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    startProcessing();
  };

  const handleReset = () => {
    reset();
    setSelectedId(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-svitok-border bg-svitok-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-svitok-muted">
          СВИТОК ЛАЙТ
        </div>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-[2.5rem] font-bold leading-tight tracking-tight text-svitok-text sm:text-4xl lg:text-5xl">
            Универсальный анализ документов
          </h1>
          <p className="max-w-2xl text-base text-svitok-muted sm:text-lg">
            Загрузите счёт, акт или накладную — AI извлечёт данные, проверит реквизиты и подскажет,
            что вы могли бы пропустить без автоматической проверки.
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-sm font-medium text-svitok-muted">Выберите пример документа</p>
        <DocumentSelector documents={documents} selectedId={selectedId} onSelect={handleSelect} />
      </section>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-dashed border-svitok-border bg-svitok-card/40 px-6 py-12 text-center"
          >
            <p className="text-base text-svitok-muted">
              Нажмите на один из примеров выше, чтобы увидеть обработку документа
            </p>
          </motion.div>
        )}

        {phase !== "idle" && selectedDocument && (
          <motion.div
            key={`${selectedDocument.id}-${phase}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <FilePreview document={selectedDocument} />

            {phase === "loading" && (
              <ProcessingAnimation progress={progress} currentStep={currentStep} />
            )}

            {phase === "result" && (
              <>
                <ResultView document={selectedDocument} />
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer text-sm font-medium text-svitok-accent transition-colors hover:text-svitok-accent/80"
                  >
                    Обработать другой документ
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "result" && <CtaSection />}
    </div>
  );
}
