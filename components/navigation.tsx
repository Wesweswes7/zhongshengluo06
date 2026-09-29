'use client';

import Link from '@/components/site-link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  type messages,
  route,
  basePath,
  type Locale,
  type Section,
} from '@/lib/site';

export type NavigationLabels = Pick<
  ReturnType<typeof messages>,
  'nav' | 'skip' | 'menu' | 'close' | 'aboutMe' | 'language'
>;

export function Navigation({
  lang,
  available,
  labels: t,
  anchors,
}: {
  lang: Locale;
  available: Section[];
  labels: NavigationLabels;
  anchors: Record<string, string[]>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const [hash, setHash] = useState('');
  const cleanPath =
    basePath && pathname.startsWith(basePath + '/')
      ? pathname.slice(basePath.length)
      : pathname;
  const rest = cleanPath
    .replace(/^\/(en|zh)(\/|$)/, '/')
    .replace(/^\/+|\/+$/g, '');
  const current = rest.split('/')[0];
  const other: Locale = lang === 'en' ? 'zh' : 'en';
  useEffect(() => {
    const syncHash = () => {
      let id = '';
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        /* Invalid fragments fall back to the page. */
      }
      setHash(
        (anchors[rest] ?? []).includes(id) ? `#${encodeURIComponent(id)}` : '',
      );
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    window.addEventListener('pageshow', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
      window.removeEventListener('pageshow', syncHash);
    };
  }, [rest, anchors]);
  useEffect(() => {
    setOpen(false);
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menu.current?.open) {
        e.preventDefault();
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      } else if (open) {
        e.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!(e.target instanceof Node)) return;
      if (!menu.current?.contains(e.target) && menu.current)
        menu.current.open = false;
      if (!header.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const reset = () => {
      const focused = document.activeElement;
      if (
        desktop.matches &&
        focused?.closest('#mobile-navigation, .menu-toggle')
      )
        header.current?.querySelector<HTMLAnchorElement>('.brand')?.focus();
      if (!desktop.matches && focused?.closest('.desktop-nav'))
        toggle.current?.focus();
      setOpen(false);
      if (menu.current) menu.current.open = false;
    };
    desktop.addEventListener('change', reset);
    return () => desktop.removeEventListener('change', reset);
  }, []);
  const navLink = (key: Section | 'home', mobile = false) => (
    <Link
      key={key}
      href={route(lang, key === 'home' ? '' : key)}
      className={
        current === key || (!current && key === 'home') ? 'active' : ''
      }
      aria-current={
        current === key || (!current && key === 'home') ? 'page' : undefined
      }
      onClick={() => {
        setOpen(false);
        if (menu.current) menu.current.open = false;
      }}
    >
      {mobile && key === 'about' ? t.aboutMe : t.nav[key]}
    </Link>
  );
  return (
    <header
      className="site-header"
      ref={header}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="header-inner container">
        <Link
          href={route(lang)}
          className="brand"
          aria-label={`${t.nav.home} — Zhongsheng Luo`}
        >
          <span>Zhongsheng Luo</span>
        </Link>
        <nav className="desktop-nav" aria-label={t.menu}>
          {navLink('home')}
          {(['research', 'learning', 'projects', 'notes'] as Section[])
            .filter((key) => available.includes(key))
            .map((key) => navLink(key))}
          <details
            className="about-menu"
            ref={menu}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                e.currentTarget.open = false;
            }}
          >
            <summary
              className={
                ['about', 'experience', 'awards'].includes(current)
                  ? 'active'
                  : ''
              }
            >
              {t.nav.about}
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="dropdown">
              {(['about', 'experience', 'awards'] as Section[]).map((k) =>
                navLink(k, true),
              )}
            </div>
          </details>
          {navLink('contact')}
        </nav>
        <div className="header-tools">
          <Link
            href={`${route(other, rest)}${hash}`}
            className="language-switch"
            aria-label={t.language}
            hrefLang={other === 'zh' ? 'zh-CN' : 'en'}
          >
            <span className={lang === 'en' ? 'selected' : ''}>EN</span>
            <span className="language-divider">/</span>
            <span className={lang === 'zh' ? 'selected' : ''}>中文</span>
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? t.close : t.menu}
            <span aria-hidden="true">{open ? '×' : '☰'}</span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className={`mobile-nav container ${open ? 'is-open' : ''}`}
        aria-label={t.menu}
        hidden={!open}
      >
        {(
          [
            'home',
            'research',
            'learning',
            'projects',
            'notes',
            'about',
            'experience',
            'awards',
            'contact',
          ] as const
        )
          .filter((key) => key === 'home' || available.includes(key))
          .map((key) => navLink(key, true))}
      </nav>
    </header>
  );
}
