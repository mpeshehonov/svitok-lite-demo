export const WORD_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  ...WORD_MIME_TYPES,
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const EXTENSION_MIME_MAP: Record<string, AllowedMimeType> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
};

export const ACCEPTED_FILE_EXTENSIONS = Object.keys(EXTENSION_MIME_MAP).join(",");

export const ACCEPTED_MIME_TYPES = ALLOWED_MIME_TYPES.join(",");

export function resolveMimeType(file: File): AllowedMimeType | null {
  if (file.type && isAllowedMimeType(file.type)) {
    return file.type;
  }

  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!extension) {
    return null;
  }

  return EXTENSION_MIME_MAP[extension] ?? null;
}

export function isAllowedMimeType(mimeType: string): mimeType is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType);
}

export function isWordMimeType(mimeType: string) {
  return WORD_MIME_TYPES.includes(mimeType as (typeof WORD_MIME_TYPES)[number]);
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateUploadFile(file: File): string | null {
  if (!resolveMimeType(file)) {
    return "Поддерживаются PDF, Word (.doc, .docx), JPG, PNG и WebP.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Файл слишком большой. Максимум — 10 МБ.";
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} Б`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1).replace(".", ",")} КБ`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} МБ`;
}

export function formatMimeType(mimeType: string): string {
  switch (mimeType) {
    case "application/pdf":
      return "PDF";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    case "application/msword":
      return "DOC";
    case "image/jpeg":
      return "JPG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WebP";
    default:
      return "Файл";
  }
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export async function analyzeUploadedDocument(file: File) {
  const validationError = validateUploadFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const mimeType = resolveMimeType(file);
  if (!mimeType) {
    throw new Error("Неподдерживаемый формат файла");
  }

  const fileBase64 = await fileToBase64(file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileBase64,
      mimeType,
      fileName: file.name,
    }),
  });

  const payload = (await response.json()) as {
    analysis?: unknown;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Не удалось распознать документ");
  }

  if (!payload.analysis || typeof payload.analysis !== "object") {
    throw new Error("Некорректный ответ сервера");
  }

  return payload.analysis;
}
