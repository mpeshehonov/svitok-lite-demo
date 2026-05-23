"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LOADING_STEPS } from "@/data/documents";
import type { DemoPhase } from "@/types/document";

const STEP_INTERVAL_MS = 1200;
const TOTAL_DURATION_MS = (LOADING_STEPS.length - 1) * STEP_INTERVAL_MS + 600;

interface UseDocumentProcessingResult {
  phase: DemoPhase;
  progress: number;
  stepIndex: number;
  currentStep: string;
  startProcessing: () => void;
  reset: () => void;
}

export function useDocumentProcessing(): UseDocumentProcessingResult {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setProgress(0);
    setStepIndex(0);
  }, [clearTimers]);

  const startProcessing = useCallback(() => {
    clearTimers();
    setPhase("loading");
    setProgress(0);
    setStepIndex(0);

    const progressStart = window.setTimeout(() => setProgress(60), 50);
    const progressMid = window.setTimeout(() => setProgress(90), 1000);
    const progressEnd = window.setTimeout(() => setProgress(100), TOTAL_DURATION_MS - 100);

    LOADING_STEPS.forEach((_, index) => {
      if (index === 0) {
        return;
      }

      const timer = window.setTimeout(() => {
        setStepIndex(index);
      }, index * STEP_INTERVAL_MS);

      timersRef.current.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      setPhase("result");
    }, TOTAL_DURATION_MS);

    timersRef.current.push(progressStart, progressMid, progressEnd, finishTimer);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    phase,
    progress,
    stepIndex,
    currentStep: LOADING_STEPS[stepIndex] ?? LOADING_STEPS[0],
    startProcessing,
    reset,
  };
}
