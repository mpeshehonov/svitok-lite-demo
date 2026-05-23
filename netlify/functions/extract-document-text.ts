import mammoth from "mammoth";
import WordExtractor from "word-extractor";

export const WORD_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export const BINARY_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  ...WORD_MIME_TYPES,
]);

export function isWordMimeType(mimeType: string) {
  return WORD_MIME_TYPES.has(mimeType);
}

export async function extractWordText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value.trim();
  }

  if (mimeType === "application/msword") {
    const extractor = new WordExtractor();
    const document = await extractor.extract(buffer);
    return document.getBody().trim();
  }

  throw new Error("Unsupported Word format");
}
