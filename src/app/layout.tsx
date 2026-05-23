import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "СВИТОК ЛАЙТ — демо анализа документов",
  description:
    "Интерактивная демонстрация модуля СВИТОК ЛАЙТ: извлечение данных, автоматические проверки и рекомендации.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
