"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

interface ProcessingAnimationProps {
  progress: number;
  currentStep: string;
}

export function ProcessingAnimation({ progress, currentStep }: ProcessingAnimationProps) {
  return (
    <Card className="border-svitok-border bg-svitok-card py-0 shadow-none">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-svitok-text">AI обрабатывает документ</p>
          <span className="text-sm tabular-nums text-svitok-muted">{progress}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-svitok-border">
          <div
            className="h-full rounded-full bg-svitok-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-svitok-muted"
        >
          {currentStep}
        </motion.p>
      </CardContent>
    </Card>
  );
}
