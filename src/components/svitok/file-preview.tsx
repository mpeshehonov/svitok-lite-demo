"use client";

import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, formatMimeType } from "@/lib/upload";
import type { DocumentExample } from "@/types/document";

interface FilePreviewProps {
  document: DocumentExample;
  fileSize?: number;
  mimeType?: string;
}

export function FilePreview({ document, fileSize, mimeType }: FilePreviewProps) {
  const typeLabel = mimeType ? formatMimeType(mimeType) : "PDF";
  const sizeLabel = fileSize ? formatFileSize(fileSize) : "—";

  return (
    <Card className="border-svitok-border bg-svitok-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-svitok-accent/15 text-svitok-accent">
          <FileText className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-svitok-muted">
            Загруженный файл
          </p>
          <p className="truncate text-sm font-semibold text-svitok-text">{document.fileName}</p>
          <p className="text-sm text-svitok-muted">
            {document.pages} стр. · {typeLabel} · {sizeLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
