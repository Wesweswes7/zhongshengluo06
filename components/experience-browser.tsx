'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type ExperienceIndexItem = {
  id: string;
  date: string;
  title: string;
};

export function ExperienceBrowser({
  items,
  label,
  children,
}: {
  items: ExperienceIndexItem[];
  label: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const articles = items.flatMap(({ id }) => {
      const article = document.getElementById(id);
      return article && root.contains(article) ? [article] : [];
    });
    if (!articles.length) return;

    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;
    let navigationTarget: HTMLElement | undefined;
    let activeId: string | undefined;
    let restoringViewport = false;
    let resizeObserver: ResizeObserver | undefined;

    const activate = (article: HTMLElement) => {
      if (activeId === article.id) return;
      activeId = article.id;
      setCurrentId(article.id);
      for (const item of articles) {
        item.toggleAttribute('data-experience-current', item === article);
      }
    };

    const update = () => {
      frame = 0;
      if (navigationTarget) {
        activate(navigationTarget);
        return;
      }

      const headerHeight =
        document.querySelector('.site-header')?.getBoundingClientRect()
          .height ?? 0;
      const readingLine = headerHeight + Math.min(innerHeight * 0.2, 160);
      let current = articles[0];
      for (const article of articles) {
        if (article.getBoundingClientRect().top <= readingLine) {
          current = article;
        } else {
          break;
        }
      }
      // A short final entry can remain below the reading line at page end.
      if (
        Math.ceil(scrollY + innerHeight) >=
        document.documentElement.scrollHeight - 2
      ) {
        const last = articles[articles.length - 1];
        if (last.getBoundingClientRect().top < innerHeight) current = last;
      }
      activate(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const settleNavigation = () => {
      clearTimeout(settleTimer);
      // Keep the selected anchor through native smooth scrolling; the next
      // manual scroll resumes viewport-based selection without changing URL.
      settleTimer = setTimeout(() => {
        navigationTarget = undefined;
      }, 180);
    };

    const onScroll = () => {
      schedule();
      if (navigationTarget) settleNavigation();
    };

    const selectHash = () => {
      let id = '';
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        // Malformed external hashes must not interrupt normal reading.
      }
      navigationTarget = articles.find((article) => article.id === id);
      if (navigationTarget) activate(navigationTarget);
      else schedule();
      settleNavigation();
    };

    const onIndexClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        '.experience-index a',
      );
      if (!link) return;
      navigationTarget = articles.find(
        (article) => link.hash === `#${article.id}`,
      );
      if (navigationTarget) activate(navigationTarget);
      settleNavigation();
      // Do not preventDefault: native anchors own focus, history and scrolling.
    };

    const resumeReading = () => {
      navigationTarget = undefined;
      clearTimeout(settleTimer);
    };

    const onHistoryNavigation = () => {
      if (restoringViewport) {
        resumeReading();
        schedule();
      } else {
        selectHash();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        selectHash();
        return;
      }

      // BFCache restores the user's reading position, which can differ from
      // the unchanged hash. The same traversal can emit popstate afterwards.
      restoringViewport = true;
      resumeReading();
      schedule();
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => {
        restoringViewport = false;
        schedule();
      }, 0);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      ) {
        resumeReading();
      }
    };

    const cleanup = () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      clearTimeout(restoreTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', onHistoryNavigation);
      window.removeEventListener('popstate', onHistoryNavigation);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('wheel', resumeReading);
      window.removeEventListener('touchstart', resumeReading);
      window.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('click', onIndexClick);
      for (const article of articles) {
        article.removeAttribute('data-experience-current');
      }
    };

    try {
      selectHash();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', schedule);
      window.addEventListener('hashchange', onHistoryNavigation);
      window.addEventListener('popstate', onHistoryNavigation);
      window.addEventListener('pageshow', onPageShow);
      window.addEventListener('wheel', resumeReading, { passive: true });
      window.addEventListener('touchstart', resumeReading, { passive: true });
      window.addEventListener('keydown', onKeyDown);
      root.addEventListener('click', onIndexClick);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(root);
      }
    } catch {
      // Enhancement failure leaves the server-rendered articles, CSS :target
      // indication and native anchor links available without an error screen.
      cleanup();
      setCurrentId(null);
    }

    return cleanup;
  }, [items]);

  return (
    <div className="experience-browser" ref={rootRef}>
      <nav className="experience-index" aria-label={label}>
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={currentId === item.id ? 'location' : undefined}
              >
                <span className="experience-index-date">{item.date}</span>
                <span className="experience-index-title">{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="experience-content">{children}</div>
    </div>
  );
}
