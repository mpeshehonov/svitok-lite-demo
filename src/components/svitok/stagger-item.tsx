"use client";

import { motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface StaggerItemProps extends MotionProps {
  index: number;
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ index, children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
