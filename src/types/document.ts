export type CheckStatus = "success" | "warning" | "error" | "info";

export interface DocumentCheck {
  status: CheckStatus;
  title: string;
  description: string;
}

export interface LineItem {
  num: number;
  name: string;
  quantity: string;
  price: string;
  amount: string;
  vat: string;
}

export interface ExtractedField {
  label: string;
  value: string;
}

export interface DocumentAction {
  title: string;
  description: string;
}

export interface DocumentExample {
  id: string;
  label: string;
  fileName: string;
  pages: number;
  fields: ExtractedField[];
  checks: DocumentCheck[];
  lineItems: LineItem[];
  actions: DocumentAction[];
}

export type DemoPhase = "idle" | "loading" | "result";
