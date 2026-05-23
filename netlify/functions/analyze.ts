import type { Handler } from "@netlify/functions";

import { ANALYZE_PROMPT } from "../../src/lib/analyze-prompt";
import { extractWordText, isWordMimeType } from "../../src/lib/extract-document-text";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash"] as const;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_ATTEMPTS_PER_MODEL = 2;
const RETRY_DELAY_MS = 1500;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

interface AnalyzeRequestBody {
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

type GeminiContentPart = { text: string } | { inline_data: { mime_type: string; data: string } };

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

function isRetryableError(status: number, message: string) {
  const lower = message.toLowerCase();

  return (
    status === 429 ||
    status === 503 ||
    lower.includes("quota") ||
    lower.includes("limit: 0") ||
    lower.includes("high demand") ||
    lower.includes("overloaded") ||
    lower.includes("unavailable") ||
    lower.includes("try again later")
  );
}

function formatUserError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("high demand") || lower.includes("try again later")) {
    return "Сервис AI временно перегружен. Подождите минуту и попробуйте снова, или выберите готовый пример.";
  }

  if (lower.includes("quota") || lower.includes("limit: 0")) {
    return "Исчерпана квота API. Попробуйте позже или используйте готовые примеры.";
  }

  if (lower.includes("extract") || lower.includes("word")) {
    return "Не удалось прочитать Word-документ. Попробуйте сохранить файл как .docx или экспортировать в PDF.";
  }

  return message;
}

function sanitizeAnalysis(raw: unknown, fileName: string) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid analysis payload");
  }

  const data = raw as Record<string, unknown>;

  return {
    id: `upload-${Date.now()}`,
    label: typeof data.label === "string" ? data.label : "Документ",
    fileName,
    pages: typeof data.pages === "number" && data.pages > 0 ? data.pages : 1,
    fields: Array.isArray(data.fields) ? data.fields : [],
    checks: Array.isArray(data.checks) ? data.checks : [],
    lineItems: Array.isArray(data.lineItems) ? data.lineItems : [],
    actions: Array.isArray(data.actions) ? data.actions : [],
  };
}

async function buildGeminiParts(
  mimeType: string,
  fileBase64: string,
  fileName: string
): Promise<GeminiContentPart[]> {
  const parts: GeminiContentPart[] = [{ text: ANALYZE_PROMPT }];

  if (isWordMimeType(mimeType)) {
    const buffer = Buffer.from(fileBase64, "base64");
    const extractedText = await extractWordText(buffer, mimeType);

    if (!extractedText) {
      throw new Error("Word document is empty or unreadable");
    }

    parts.push({
      text: `Текст Word-документа "${fileName}":\n\n${extractedText}`,
    });

    return parts;
  }

  parts.push({
    inline_data: {
      mime_type: mimeType,
      data: fileBase64,
    },
  });

  return parts;
}

async function callGemini(
  apiKey: string,
  model: (typeof GEMINI_MODELS)[number],
  parts: GeminiContentPart[]
) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    }
  );

  const data = (await response.json()) as GeminiResponse;

  return { response, data };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "GEMINI_API_KEY is not configured" });
  }

  let body: AnalyzeRequestBody;
  try {
    body = JSON.parse(event.body ?? "{}") as AnalyzeRequestBody;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const { fileBase64, mimeType, fileName } = body;

  if (!fileBase64 || !mimeType || !fileName) {
    return jsonResponse(400, { error: "fileBase64, mimeType and fileName are required" });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(400, {
      error: "Unsupported file type. Use PDF, Word (.doc, .docx), JPG, PNG or WebP.",
    });
  }

  const fileSizeBytes = Math.ceil((fileBase64.length * 3) / 4);
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return jsonResponse(400, { error: "File is too large. Maximum size is 10 MB." });
  }

  try {
    const parts = await buildGeminiParts(mimeType, fileBase64, fileName);
    let lastError = "Gemini API request failed";

    for (const model of GEMINI_MODELS) {
      for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
        if (attempt > 0) {
          await sleep(RETRY_DELAY_MS);
        }

        const { response, data } = await callGemini(apiKey, model, parts);

        if (!response.ok) {
          lastError = data.error?.message ?? `Gemini API request failed (${model})`;

          if (isRetryableError(response.status, lastError)) {
            continue;
          }

          return jsonResponse(502, { error: formatUserError(lastError) });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          lastError = `Empty response from Gemini (${model})`;
          continue;
        }

        const parsed = JSON.parse(text) as unknown;
        const analysis = sanitizeAnalysis(parsed, fileName);

        return jsonResponse(200, { analysis });
      }
    }

    return jsonResponse(502, { error: formatUserError(lastError) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Document analysis failed";
    return jsonResponse(500, { error: formatUserError(message) });
  }
};
