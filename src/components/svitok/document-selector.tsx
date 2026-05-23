"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DocumentExample } from "@/types/document";

interface DocumentSelectorProps {
  documents: DocumentExample[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DocumentSelector({ documents, selectedId, onSelect }: DocumentSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {documents.map((document) => {
        const isActive = selectedId === document.id;

        return (
          <Button
            key={document.id}
            type="button"
            variant="outline"
            onClick={() => onSelect(document.id)}
            className={cn(
              "h-auto min-h-14 justify-start rounded-xl border-svitok-border bg-svitok-card px-4 py-3 text-left whitespace-normal transition-all duration-200 hover:-translate-y-0.5 hover:bg-svitok-card hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
              isActive &&
                "border-svitok-accent bg-svitok-accent/10 shadow-[0_0_0_1px_rgba(37,99,235,0.35)]"
            )}
          >
            <span className="block text-sm font-semibold text-svitok-text">{document.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
