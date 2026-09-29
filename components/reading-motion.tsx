'use client';

import { useEffect } from 'react';

// Progressive enhancement only: server-rendered content is always visible.
// Native links, focus, restored scroll positions and fragment targets take priority.
export function ReadingMotion() {
  useEffect(() => {
    let cleanup = () => {};
    try {
      if (!('IntersectionObserver' in window) || !Element.prototype.animate)
        return;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.research-card, ' +
            '.research-feature .page-heading, .research-detail, .experience-browser .timeline-item',
        ),
      );
      const homeHeading = document.querySelector<HTMLElement>(
        '.research-overview .section-heading',
      );
      if (homeHeading) elements.unshift(homeHeading);
      if (!elements.length) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const seen = new Set<HTMLElement>();
      const running = new Map<HTMLElement, Animation>();
      let lastY = window.scrollY;
      let lastTime = performance.now();
      let fastUntil = 0;
      let frame = 0;

      const target = () => {
        try {
          return document.getElementById(
            decodeURIComponent(location.hash.slice(1)),
          );
        } catch {
          return null;
        }
      };
      const protectedElement = (el: HTMLElement) => {
        const fragment = target();
        return (
          el === fragment ||
          (fragment !== null && el.contains(fragment)) ||
          el.contains(document.activeElement)
        );
      };
      const settle = (el: HTMLElement) => {
        seen.add(el);
        running.get(el)?.cancel();
        running.delete(el);
        el.dataset.motionState = 'settled';
      };

      // Do not replay an opening sequence after refresh/restoration in the page.
      const restored = window.scrollY > 8 || Boolean(location.hash);
      elements.forEach((el) => {
        if (
          el.dataset.motionState === 'settled' ||
          protectedElement(el) ||
          (restored && el.getBoundingClientRect().top < innerHeight)
        ) {
          settle(el);
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          const entering = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLElement);
          const groupCounts = new Map<Element | null, number>();
          entering.forEach((el) => {
            observer.unobserve(el);
            if (seen.has(el)) return;
            const bounds = el.getBoundingClientRect();
            if (
              reduced.matches ||
              protectedElement(el) ||
              performance.now() < fastUntil ||
              bounds.bottom <= 0 ||
              bounds.top >= innerHeight
            ) {
              settle(el);
              return;
            }
            seen.add(el);
            const group = el.closest(
              '.research-grid, .research-details, .timeline',
            );
            const order = groupCounts.get(group) ?? 0;
            groupCounts.set(group, order + 1);
            try {
              const animation = el.animate(
                [
                  { transform: 'translateY(16px)', opacity: 0.86 },
                  { transform: 'translateY(0)', opacity: 1 },
                ],
                {
                  duration: 560,
                  delay: Math.min(order, 3) * 70,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  // No retained invisible state if animation is interrupted.
                  fill: 'backwards',
                },
              );
              running.set(el, animation);
              el.dataset.motionState = 'playing';
              animation.onfinish = () => settle(el);
            } catch {
              settle(el);
            }
          });
        },
        { threshold: 0.08 },
      );
      const onScroll = () => {
        const now = performance.now();
        const distance = Math.abs(window.scrollY - lastY);
        if (
          distance > innerHeight * 0.5 ||
          distance / Math.max(now - lastTime, 1) > 2.5
        ) {
          fastUntil = now + 180;
        }
        lastY = window.scrollY;
        lastTime = now;
        if (!frame) {
          frame = requestAnimationFrame(() => {
            frame = 0;
            running.forEach((_, el) => {
              const box = el.getBoundingClientRect();
              if (
                performance.now() < fastUntil ||
                box.bottom <= 0 ||
                box.top >= innerHeight
              )
                settle(el);
            });
          });
        }
      };
      const onFocusOrHash = () =>
        elements.forEach((el) => {
          if (protectedElement(el)) settle(el);
        });
      const onPreference = () => {
        if (reduced.matches) running.forEach((_, el) => settle(el));
      };
      const onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted)
          elements.forEach((el) => {
            if (el.getBoundingClientRect().top < innerHeight) settle(el);
          });
      };
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        running.forEach((_, el) => settle(el));
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('hashchange', onFocusOrHash);
        window.removeEventListener('popstate', onFocusOrHash);
        window.removeEventListener('pageshow', onPageShow);
        document.removeEventListener('focusin', onFocusOrHash);
        reduced.removeEventListener?.('change', onPreference);
      };
      elements.forEach((el) => {
        if (!seen.has(el)) observer.observe(el);
      });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('hashchange', onFocusOrHash);
      window.addEventListener('popstate', onFocusOrHash);
      window.addEventListener('pageshow', onPageShow);
      document.addEventListener('focusin', onFocusOrHash);
      reduced.addEventListener('change', onPreference);
      return cleanup;
    } catch {
      // Enhancement failures must never replace the server-rendered page.
      cleanup();
    }
  }, []);
  return null;
}
