import type { ReactNode } from 'react';
import { Navigation } from './navigation';
import { NavigationHints } from './navigation-hints';
import { ReadingMotion } from './reading-motion';
import { Footer } from './ui';
import { type Locale, asset, messages } from '@/lib/site';
import { visibleSections } from '@/lib/content';
import '@/app/globals.css';
import '@/app/editorial.css';
import '@/app/experience.css';
import '@/app/research.css';
import '@/app/research-graph.css';

export function Document({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  const { nav, skip, menu, close, aboutMe, language } = messages(lang);
  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href={asset('/favicon.svg')} />
        <NavigationHints />
      </head>
      <body>
        <Navigation
          lang={lang}
          available={visibleSections(lang)}
          labels={{ nav, skip, menu, close, aboutMe, language }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer lang={lang} />
        <ReadingMotion />
      </body>
    </html>
  );
}
