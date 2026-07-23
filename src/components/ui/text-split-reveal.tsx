/* Adapted from 21st.dev — @animbits/text-split-reveal (id 19330), pulled via
   the 21st.dev MCP. The visual is the source design, unchanged: the string is
   cut at its midpoint into two halves that fade in, slide up, and unclip
   outward from the centre seam — reading as a gate opening.

   What changed and why: the source drives this with framer-motion. framer's
   animations are rAF-driven and, in THIS app, do not fire reliably — verified
   exhaustively on the live deploy, where the page's OWN framer hero background
   also sticks at its `initial` state (opacity 0) while the CSS-transition
   reveals beside it complete. That is precisely why every reveal these pages
   ship (Reveal, ClipImg) is CSS-transition driven, not framer. So this drives
   the identical reveal with CSS transitions on a post-mount `shown` flag — the
   same mechanism the rest of the page uses. It animates in every runtime.
   Reduced motion is handled one level up in GateLine (renders plain text). */
"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface TextSplitRevealProps {
  children: string;
  /* Container tag. Defaults to "p" (source). Use "span" to nest in a heading. */
  as?: "p" | "span" | "div";
  className?: string;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function TextSplitReveal({
  children,
  className,
  as: Tag = "p",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.1,
}: TextSplitRevealProps) {
  const midpoint = Math.ceil(children.length / 2);
  const leftHalf = children.slice(0, midpoint);
  const rightHalf = children.slice(midpoint);

  // Post-mount flip: paint the hidden state first, then transition to shown.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(true);
  }, []);

  const half = (
    d: number,
    hiddenClip: string,
    shownClip: string,
  ): CSSProperties => ({
    display: "inline-block",
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(20px)",
    clipPath: shown ? shownClip : hiddenClip,
    transition:
      `opacity ${duration}s ${EASE} ${d}s, ` +
      `transform ${duration}s ${EASE} ${d}s, ` +
      `clip-path ${duration}s ${EASE} ${d}s`,
  });

  return (
    <Tag className={cn("overflow-hidden", className)}>
      <span style={half(delay, "inset(0 100% 0 0)", "inset(0 0% 0 0)")}>
        {leftHalf}
      </span>
      <span style={half(delay + staggerDelay, "inset(0 0 0 100%)", "inset(0 0 0 0%)")}>
        {rightHalf}
      </span>
    </Tag>
  );
}

export default TextSplitReveal;
