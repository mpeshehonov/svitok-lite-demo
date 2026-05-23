"use client";

import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DocumentExample } from "@/types/document";

interface FilePreviewProps {
  document: DocumentExample;
}

export function FilePreview({ document }: FilePreviewProps) {
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
          <p className="text-sm text-svitok-muted">{document.pages} стр. · PDF · 1,2 МБ</p>
        </div>
      </CardContent>
    </Card>
  );
}
