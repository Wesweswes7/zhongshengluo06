import Link from '@/components/site-link';
import type { ReactNode } from 'react';
import profile from '@/data/profile.json';
import { asset, messages, route, type Locale, type Section } from '@/lib/site';
import { visibleSections } from '@/lib/content';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="arrow"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function CV({
  lang,
  button = false,
}: {
  lang: Locale;
  button?: boolean;
}) {
  const t = messages(lang);
  const cv = (profile.cv as Record<Locale, string | null>)[lang];
  return cv ? (
    <a
      href={asset(cv)}
      className={button ? 'button button-light' : 'text-link'}
      download
    >
      {t.downloadCV}
      <Arrow diagonal />
    </a>
  ) : null;
}
export function SectionHeading({
  label,
  title,
  href,
  link,
}: {
  label: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {href && link && <TextLink href={href}>{link}</TextLink>}
    </div>
  );
}
export function PageHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="page-intro">{intro}</p>
    </div>
  );
}
export function EmptyState({
  title,
  text,
  compact = false,
}: {
  title: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <span className="empty-symbol" aria-hidden="true">
        [ &nbsp; ]
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
export function ResearchIcon({ id }: { id: string }) {
  // These three motifs use the same nodes and paths as the relationship graph.
  const paths: Record<string, string> = {
    'artificial-intelligence': 'M12 5v14M5 12h14M7 7l10 10M7 17 17 7',
    'computational-social-science': 'm12 5 7 14H5L12 5Zm0 0v9m-7 5 7-5 7 5',
    'ai-governance': 'm5 8 7-4 7 4v8l-7 4-7-4V8Zm0 0 7 4 7-4m-7 4v8',
  };
  return (
    <svg
      className="research-icon"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[id]} />
      <circle
        cx="12"
        cy={
          id === 'ai-governance'
            ? '12'
            : id === 'computational-social-science'
              ? '14'
              : '12'
        }
        r="2"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
export function ContactStrip({ lang }: { lang: Locale }) {
  const t = messages(lang);
  return (
    <section className="contact-strip">
      <div>
        <p className="eyebrow">{t.contactLabel}</p>
        <h2>{t.contactHeading}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <div className="contact-links">
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email}
          <Arrow diagonal />
        </a>
        <a
          className="text-link muted-link"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub / {profile.githubUsername}
          <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
export function Footer({ lang }: { lang: Locale }) {
  const t = messages(lang);
  const available = visibleSections(lang);
  return (
    <footer className="site-footer container">
      <div className="footer-top">
        <Link href={route(lang)} className="footer-name">
          Zhongsheng Luo <span>罗中圣</span>
        </Link>
        <p>{t.footerLine}</p>
      </div>
      <nav aria-label={lang === 'en' ? 'Footer navigation' : '页脚导航'}>
        {Object.entries(t.nav)
          .filter(
            ([key]) => key === 'home' || available.includes(key as Section),
          )
          .map(([key, label]) => (
            <Link key={key} href={route(lang, key === 'home' ? '' : key)}>
              {label}
            </Link>
          ))}
      </nav>
      <div className="footer-bottom">
        <span>
          © {new Date(profile.updatedAt).getFullYear()} Zhongsheng Luo
        </span>
        <span>
          {t.updated} · {profile.updatedAt}
        </span>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub <Arrow diagonal />
        </a>
      </div>
    </footer>
  );
}
