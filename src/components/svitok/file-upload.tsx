"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILE_EXTENSIONS, ACCEPTED_MIME_TYPES, validateUploadFile } from "@/lib/upload";

interface FileUploadProps {
  disabled?: boolean;
  onUpload: (file: File) => void;
}

export function FileUpload({ disabled = false, onUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const validationError = validateUploadFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    onUpload(file);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (disabled) {
            return;
          }
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "rounded-2xl border border-dashed px-6 py-8 text-center transition-all duration-200",
          isDragging
            ? "border-svitok-accent bg-svitok-accent/10"
            : "border-svitok-border bg-svitok-card/40",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-svitok-accent/15 text-svitok-accent">
          <Upload className="size-6" />
        </div>
        <p className="text-sm font-medium text-svitok-text">Загрузите свой документ</p>
        <p className="mt-1 text-sm text-svitok-muted">PDF, Word (.doc, .docx), JPG, PNG, WebP · до 10 МБ</p>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mt-4 cursor-pointer border-svitok-border bg-svitok-card hover:bg-svitok-card/80"
        >
          Выбрать файл
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={`${ACCEPTED_FILE_EXTENSIONS},${ACCEPTED_MIME_TYPES}`}
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {localError && <p className="text-sm text-svitok-error">{localError}</p>}
    </div>
  );
}
