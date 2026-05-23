"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DONE_STEP, PROCESSING_STEPS } from "@/data/documents";
import type { DemoPhase, DocumentExample } from "@/types/document";

const STEP_INTERVAL_MS = 1200;
const MIN_DURATION_MS = (PROCESSING_STEPS.length - 1) * STEP_INTERVAL_MS + 600;
const DONE_STEP_DELAY_MS = 450;

interface UseDocumentProcessingResult {
  phase: DemoPhase;
  progress: number;
  currentStep: string;
  result: DocumentExample | null;
  error: string | null;
  startProcessing: () => void;
  submitResult: (document: DocumentExample) => void;
  submitError: (message: string) => void;
  reset: () => void;
}

export function useDocumentProcessing(): UseDocumentProcessingResult {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [showDoneStep, setShowDoneStep] = useState(false);
  const [result, setResult] = useState<DocumentExample | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const minDurationDoneRef = useRef(false);
  const pendingResultRef = useRef<DocumentExample | null>(null);
  const pendingErrorRef = useRef<string | null>(null);
  const isCompletingRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const finalize = useCallback(() => {
    if (pendingErrorRef.current) {
      setError(pendingErrorRef.current);
      setResult(null);
      setPhase("error");
      return;
    }

    if (pendingResultRef.current) {
      setResult(pendingResultRef.current);
      setError(null);
      setPhase("result");
    }
  }, []);

  const tryComplete = useCallback(() => {
    if (isCompletingRef.current) {
      return;
    }

    if (!minDurationDoneRef.current) {
      return;
    }

    if (!pendingResultRef.current && !pendingErrorRef.current) {
      return;
    }

    isCompletingRef.current = true;
    setShowDoneStep(true);
    setProgress(100);

    const doneTimer = window.setTimeout(() => {
      finalize();
    }, DONE_STEP_DELAY_MS);

    timersRef.current.push(doneTimer);
  }, [finalize]);

  const reset = useCallback(() => {
    clearTimers();
    minDurationDoneRef.current = false;
    pendingResultRef.current = null;
    pendingErrorRef.current = null;
    isCompletingRef.current = false;
    setPhase("idle");
    setProgress(0);
    setStepIndex(0);
    setShowDoneStep(false);
    setResult(null);
    setError(null);
  }, [clearTimers]);

  const startProcessing = useCallback(() => {
    clearTimers();
    minDurationDoneRef.current = false;
    pendingResultRef.current = null;
    pendingErrorRef.current = null;
    isCompletingRef.current = false;
    setPhase("loading");
    setProgress(0);
    setStepIndex(0);
    setShowDoneStep(false);
    setResult(null);
    setError(null);

    const progressStart = window.setTimeout(() => setProgress(60), 50);
    const progressMid = window.setTimeout(() => setProgress(90), 1000);

    for (let index = 1; index < PROCESSING_STEPS.length; index++) {
      const timer = window.setTimeout(() => {
        setStepIndex(index);
      }, index * STEP_INTERVAL_MS);

      timersRef.current.push(timer);
    }

    const minDurationTimer = window.setTimeout(() => {
      minDurationDoneRef.current = true;
      tryComplete();
    }, MIN_DURATION_MS);

    timersRef.current.push(progressStart, progressMid, minDurationTimer);
  }, [clearTimers, tryComplete]);

  const submitResult = useCallback(
    (document: DocumentExample) => {
      pendingResultRef.current = document;
      pendingErrorRef.current = null;
      tryComplete();
    },
    [tryComplete]
  );

  const submitError = useCallback(
    (message: string) => {
      pendingErrorRef.current = message;
      pendingResultRef.current = null;
      tryComplete();
    },
    [tryComplete]
  );

  useEffect(() => clearTimers, [clearTimers]);

  const currentStep = showDoneStep
    ? DONE_STEP
    : (PROCESSING_STEPS[stepIndex] ?? PROCESSING_STEPS[0]);

  return {
    phase,
    progress,
    currentStep,
    result,
    error,
    startProcessing,
    submitResult,
    submitError,
    reset,
  };
}
