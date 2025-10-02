'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export default function AnimatedNumber({ value, prefix = '', suffix = '' }: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);

  // Update displayed value on change (to trigger key-based animation)
  if (displayed !== value) {
    setDisplayed(value);
  }

  return (
    <span className="inline-block">
      {prefix}
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -4 }}
          transition={{ duration: 0.25 }}
          className="inline-block"
        >
          {displayed.toLocaleString()}
        </motion.span>
      </AnimatePresence>
      {suffix}
    </span>
  );
}
