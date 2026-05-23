"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { CtaSection } from "@/components/svitok/cta-section";
import { DocumentSelector } from "@/components/svitok/document-selector";
import { FilePreview } from "@/components/svitok/file-preview";
import { FileUpload } from "@/components/svitok/file-upload";
import { ProcessingAnimation } from "@/components/svitok/processing-animation";
import { ResultView } from "@/components/svitok/result-view";
import { documents } from "@/data/documents";
import { useDocumentProcessing } from "@/hooks/use-document-processing";
import { analyzeUploadedDocument } from "@/lib/upload";
import type { DocumentExample } from "@/types/document";

function parseAnalysisResult(raw: unknown, fileName: string): DocumentExample {
  if (!raw || typeof raw !== "object") {
    throw new Error("Некорректный ответ сервера");
  }

  const data = raw as Record<string, unknown>;

  return {
    id: typeof data.id === "string" ? data.id : `upload-${Date.now()}`,
    label: typeof data.label === "string" ? data.label : "Документ",
    fileName,
    pages: typeof data.pages === "number" && data.pages > 0 ? data.pages : 1,
    fields: Array.isArray(data.fields) ? (data.fields as DocumentExample["fields"]) : [],
    checks: Array.isArray(data.checks) ? (data.checks as DocumentExample["checks"]) : [],
    lineItems: Array.isArray(data.lineItems)
      ? (data.lineItems as DocumentExample["lineItems"])
      : [],
    actions: Array.isArray(data.actions) ? (data.actions as DocumentExample["actions"]) : [],
  };
}

export function DemoPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const {
    phase,
    progress,
    currentStep,
    result,
    error,
    startProcessing,
    submitResult,
    submitError,
    reset,
  } = useDocumentProcessing();

  const sampleDocument = useMemo(
    () => documents.find((document) => document.id === selectedId) ?? null,
    [selectedId]
  );

  const previewDocument = useMemo((): DocumentExample | null => {
    if (result) {
      return result;
    }

    if (sampleDocument) {
      return sampleDocument;
    }

    if (uploadedFile) {
      return {
        id: "pending",
        label: "Загрузка",
        fileName: uploadedFile.name,
        pages: 1,
        fields: [],
        checks: [],
        lineItems: [],
        actions: [],
      };
    }

    return null;
  }, [result, sampleDocument, uploadedFile]);

  const handleSelect = (id: string) => {
    setUploadedFile(null);
    setSelectedId(id);
    startProcessing();

    const document = documents.find((item) => item.id === id);
    if (document) {
      submitResult(document);
    }
  };

  const handleUpload = async (file: File) => {
    setSelectedId(null);
    setUploadedFile(file);
    startProcessing();

    try {
      const analysis = await analyzeUploadedDocument(file);
      submitResult(parseAnalysisResult(analysis, file.name));
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Не удалось распознать документ";
      submitError(message);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedId(null);
    setUploadedFile(null);
  };

  const isBusy = phase === "loading";

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
            Загрузите счёт, акт, накладную или Word-документ — AI извлечёт данные, проверит
            реквизиты и подскажет, что вы могли бы пропустить без автоматической проверки.
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-sm font-medium text-svitok-muted">Выберите пример документа</p>
        <DocumentSelector
          documents={documents}
          selectedId={selectedId}
          onSelect={handleSelect}
          disabled={isBusy}
        />
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-svitok-muted">Или загрузите свой документ</p>
        <FileUpload disabled={isBusy} onUpload={handleUpload} />
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
              Выберите пример или загрузите файл, чтобы увидеть анализ документа
            </p>
          </motion.div>
        )}

        {phase === "loading" && previewDocument && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <FilePreview
              document={previewDocument}
              fileSize={uploadedFile?.size}
              mimeType={uploadedFile?.type}
            />
            <ProcessingAnimation progress={progress} currentStep={currentStep} />
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <FilePreview
              document={result}
              fileSize={uploadedFile?.size}
              mimeType={uploadedFile?.type}
            />
            <ResultView document={result} />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer text-sm font-medium text-svitok-accent transition-colors hover:text-svitok-accent/80"
              >
                Обработать другой документ
              </button>
            </div>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-svitok-error/20 bg-svitok-error/10 px-6 py-5">
              <p className="text-sm font-semibold text-svitok-error">
                Не удалось обработать документ
              </p>
              <p className="mt-2 text-sm text-svitok-muted">{error}</p>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer text-sm font-medium text-svitok-accent transition-colors hover:text-svitok-accent/80"
              >
                Попробовать снова
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "result" && <CtaSection />}
    </div>
  );
}
