/* Vendored from 21st.dev — @animbits/text-split-reveal (id 19330), pulled via
   the 21st.dev MCP. Two deliberate deltas from the source import — both are
   runtime-compat fixes for THIS app, not aesthetic edits; the visual (a
   clip-path split opening from the centre seam) is exactly the source design:

   1. `motion` comes from framer-motion (the app's motion runtime), not
      motion/react. A second motion runtime left the component inert in the
      production build.
   2. The reveal is triggered by a post-mount state flip rather than framer's
      first-mount initial->animate, which does not fire for these nested spans
      in this app's production build (verified on the live deploy: halves stuck
      at opacity 0). This is the same post-mount pattern VerticalCutReveal and
      the pages' own Reveal helpers use, and which works reliably here. */
"use client";
import { useEffect, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
export interface TextSplitRevealProps extends Omit<
  HTMLMotionProps<"p">,
  "children"
> {
  children: string;
  /* Root tag. Defaults to "p" (verbatim). Set "span" to nest inside a heading
     without invalid p-in-h1 markup — reveal logic below is unchanged. */
  as?: "p" | "span" | "div";
  duration?: number;
  delay?: number;
  staggerDelay?: number;
}
export function TextSplitReveal({
  children,
  className,
  as = "p",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.1,
  ...props
}: TextSplitRevealProps) {
  const midpoint = Math.ceil(children.length / 2);
  const leftHalf = children.slice(0, midpoint);
  const rightHalf = children.slice(midpoint);
  const MotionTag = motion[as] as typeof motion.p;

  // Post-mount trigger (see file header): start hidden, flip on the next frame.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const leftHidden = { opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" };
  const leftShown = { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" };
  const rightHidden = { opacity: 0, y: 20, clipPath: "inset(0 0 0 100%)" };
  const rightShown = { opacity: 1, y: 0, clipPath: "inset(0 0 0 0%)" };

  return (
    <MotionTag className={cn("overflow-hidden", className)} {...props}>
      <motion.span
        className="inline-block"
        initial={leftHidden}
        animate={shown ? leftShown : leftHidden}
        transition={{
          duration,
          delay,
          ease: "easeOut",
        }}
      >
        {leftHalf}
      </motion.span>
      <motion.span
        className="inline-block"
        initial={rightHidden}
        animate={shown ? rightShown : rightHidden}
        transition={{
          duration,
          delay: delay + staggerDelay,
          ease: "easeOut",
        }}
      >
        {rightHalf}
      </motion.span>
    </MotionTag>
  );
}

export default TextSplitReveal;
