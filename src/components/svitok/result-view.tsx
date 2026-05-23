"use client";

import { StaggerItem } from "@/components/svitok/stagger-item";
import {
  getStatusLabelClass,
  getStatusRowClass,
  StatusBadge,
} from "@/components/svitok/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DocumentExample } from "@/types/document";

interface ResultViewProps {
  document: DocumentExample;
}

export function ResultView({ document }: ResultViewProps) {
  let rowIndex = 0;

  return (
    <div className="space-y-6">
      <StaggerItem index={rowIndex++}>
        <Card className="border-svitok-border bg-svitok-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <CardHeader className="border-b border-svitok-border px-5 pt-5 pb-4">
            <CardTitle className="text-xl font-semibold text-svitok-text">
              Извлечённые поля
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-svitok-border hover:bg-transparent">
                    <TableHead className="min-w-[180px] text-svitok-muted">Поле</TableHead>
                    <TableHead className="text-svitok-muted">Извлечённое значение</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.fields.map((field, index) => (
                    <TableRow key={field.label} className="border-svitok-border">
                      <TableCell className="text-sm font-medium text-svitok-muted">
                        {field.label}
                      </TableCell>
                      <TableCell
                        className="text-sm text-svitok-text"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {field.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem index={rowIndex++}>
        <Card className="border-svitok-border bg-svitok-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <CardHeader className="border-b border-svitok-border px-5 pt-5 pb-4">
            <CardTitle className="text-xl font-semibold text-svitok-text">
              Автоматические проверки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {document.checks.map((check, index) => (
              <div
                key={check.title}
                className={`flex gap-3 rounded-xl border p-4 ${getStatusRowClass(check.status)}`}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <StatusBadge status={check.status} />
                <div className="min-w-0 space-y-1">
                  <p className={`text-sm font-semibold ${getStatusLabelClass(check.status)}`}>
                    {check.title}
                  </p>
                  <p className="text-sm text-svitok-muted">{check.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem index={rowIndex++}>
        <Card className="border-svitok-border bg-svitok-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <CardHeader className="border-b border-svitok-border px-5 pt-5 pb-4">
            <CardTitle className="text-xl font-semibold text-svitok-text">
              Позиции документа
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-svitok-border hover:bg-transparent">
                    <TableHead className="w-12 text-svitok-muted">#</TableHead>
                    <TableHead className="min-w-[220px] text-svitok-muted">Наименование</TableHead>
                    <TableHead className="text-svitok-muted">Кол-во</TableHead>
                    <TableHead className="text-svitok-muted">Цена</TableHead>
                    <TableHead className="text-svitok-muted">Сумма</TableHead>
                    <TableHead className="text-svitok-muted">НДС</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.lineItems.map((item) => (
                    <TableRow key={item.num} className="border-svitok-border">
                      <TableCell className="text-sm text-svitok-muted">{item.num}</TableCell>
                      <TableCell className="text-sm text-svitok-text">{item.name}</TableCell>
                      <TableCell className="text-sm text-svitok-text">{item.quantity}</TableCell>
                      <TableCell className="text-sm text-svitok-text">{item.price}</TableCell>
                      <TableCell className="text-sm font-medium text-svitok-text">
                        {item.amount}
                      </TableCell>
                      <TableCell className="text-sm text-svitok-muted">{item.vat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem index={rowIndex++}>
        <Card className="border-svitok-border bg-svitok-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <CardHeader className="border-b border-svitok-border px-5 pt-5 pb-4">
            <CardTitle className="text-xl font-semibold text-svitok-text">
              Что нужно сделать
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {document.actions.map((action) => (
              <div
                key={action.title}
                className="flex gap-3 rounded-xl border border-svitok-accent/20 bg-svitok-accent/10 p-4"
              >
                <StatusBadge status="info" />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-svitok-accent">{action.title}</p>
                  <p className="text-sm text-svitok-muted">{action.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>
    </div>
  );
}
