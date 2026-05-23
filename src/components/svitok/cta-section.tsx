"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <Card className="border-svitok-border bg-svitok-card py-0 shadow-none">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-svitok-text">Хочу такое для компании</h2>
          <p className="text-sm text-svitok-muted">
            Оставьте email — покажем, как СВИТОК автоматизирует ваш документооборот.
          </p>
        </div>

        {submitted ? (
          <p className="rounded-xl border border-svitok-success/20 bg-svitok-success/10 px-4 py-3 text-sm text-svitok-success">
            Спасибо! Мы свяжемся с вами по адресу {email}.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="you@company.ru"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border-svitok-border bg-[#12151f] text-svitok-text placeholder:text-svitok-muted"
            />
            <Button
              type="submit"
              className="shrink-0 bg-svitok-accent text-white hover:bg-svitok-accent/90"
            >
              Отправить
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
