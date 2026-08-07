'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/** Thin reading-progress bar. Uses a compositor-only transform, so it never triggers layout. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,#4F7DF9,#8B5CF6_60%,#10B981)] shadow-[0_0_12px_rgba(79,125,249,0.55)]"
    />
  );
}
