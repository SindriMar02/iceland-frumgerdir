/* Vendored from 21st.dev — @animbits/text-split-reveal (id 19330), pulled via
   the 21st.dev MCP. One deliberate change from the source import: it ships
   against `motion/react` (motion v12), but this app runs `framer-motion` v11
   everywhere else. Importing the component's `motion` from the OTHER instance
   left its mount animation stuck at `initial` in production (two motion
   runtimes fighting over the rAF loop). Same library, identical API — pointing
   it at framer-motion makes the reveal fire reliably. */
"use client";
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
  return (
    <MotionTag className={cn("overflow-hidden", className)} {...props}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
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
        initial={{ opacity: 0, y: 20, clipPath: "inset(0 0 0 100%)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0%)" }}
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
