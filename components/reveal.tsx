"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Wraps a group of items. Every descendant with `data-reveal` rises into
 * place as it scrolls into view, staggered when several arrive together.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          ref.current
        );

        gsap.set(targets, { y: 32, autoAlpha: 0 });

        ScrollTrigger.batch(targets, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
              clearProps: "transform,opacity,visibility",
            }),
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}