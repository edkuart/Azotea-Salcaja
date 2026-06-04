"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function DesignEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // Give React time to paint the new page's DOM
    const run = () => {
      const els = document.querySelectorAll<HTMLElement>(".reveal");

      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("is-visible"));
        return () => {};
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const delay = Number(
                (e.target as HTMLElement).dataset.revealDelay ?? 0,
              );
              setTimeout(() => e.target.classList.add("is-visible"), delay);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      els.forEach((el) => {
        // Elements already in viewport → show immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const delay = Number(el.dataset.revealDelay ?? 0);
          setTimeout(() => el.classList.add("is-visible"), delay);
        } else {
          io.observe(el);
        }
      });

      return () => io.disconnect();
    };

    // Small rAF to let the new page render before we query .reveal elements
    let cleanup: (() => void) | undefined;
    const id = requestAnimationFrame(() => { cleanup = run(); });
    return () => { cancelAnimationFrame(id); cleanup?.(); };
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty(
            "--scroll-y",
            String(window.scrollY),
          );
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
