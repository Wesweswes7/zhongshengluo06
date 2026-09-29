import Link from '@/components/site-link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import profile from '@/data/profile.json';
import research from '@/data/research.json';
import learning from '@/data/learning.json';
import experience from '@/data/experience.json';
import awards from '@/data/awards.json';
import categories from '@/data/categories.json';
import publications from '@/data/publications.json';
import photos from '@/data/photos.json';
import { PhotoCarousel } from './photo-carousel';
import { ExperienceBrowser } from './experience-browser';
import { ResearchGraph, ResearchShowcase } from './research-graph';
import {
  messages,
  asset,
  route,
  label,
  type Locale,
  type Section,
  type Localized,
} from '@/lib/site';
import {
  notes,
  projects,
  projectBody,
  type Note,
  type Project,
} from '@/lib/content';
import {
  Arrow,
  CV,
  ResearchIcon,
  ContactStrip,
  EmptyState,
  PageHeading,
  SectionHeading,
  TextLink,
} from './ui';

function ResearchCards({ lang }: { lang: Locale }) {
  return (
    <div className="research-grid">
      {research.map((item) => (
        <Link
          className="research-card"
          data-research-id={item.id}
          href={`${route(lang, 'research')}#${item.id}`}
          key={item.id}
        >
          <div className="research-card-top">
            <ResearchIcon id={item.id} />
            <span className="item-number">{item.number}</span>
          </div>
          <h3>{item.title[lang]}</h3>
          <p>{item.description[lang]}</p>
          <span className="card-bottom">
            {item.short[lang]}
            <Arrow />
          </span>
        </Link>
      ))}
    </div>
  );
}
function LearningCards({
  lang,
  full = false,
}: {
  lang: Locale;
  full?: boolean;
}) {
  const t = messages(lang);
  return (
    <div className={`learning-grid ${full ? 'full' : ''}`}>
      {learning
        .filter((i) => full || i.status !== 'planned')
        .map((item) => (
          <div
            className={`learning-card ${item.status === 'planned' ? 'planned' : ''}`}
            key={item.id}
          >
            <div className="learning-card-top">
              <span className="item-number">{item.number}</span>
              <span className="status">
                {item.status === 'planned' ? t.planned : t.inProgress}
              </span>
            </div>
            <h3>{item.title[lang]}</h3>
            <ul>
              {item.items[lang].map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
function Skills({ lang }: { lang: Locale }) {
  const t = messages(lang);
  return (
    <section className="content-section">
      <SectionHeading label={t.skills} title={t.skillsIntro} />
      <div className="skills-grid">
        {profile.skills.map((s) => (
          <div key={s.name}>
            <strong>{label(s.name, lang)}</strong>
            <span>{s.status[lang]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function NoteList({ lang, items }: { lang: Locale; items: Note[] }) {
  return (
    <div className="note-list">
      {items.map((note) => (
        <Link
          className="note-row"
          key={note.slug}
          href={route(lang, `notes/${note.slug}`)}
        >
          <div className="note-meta">
            <span>{label(note.category, lang)}</span>
            <time dateTime={note.date}>{note.date}</time>
          </div>
          <div>
            <h3>{note.title}</h3>
            <p>{note.summary}</p>
          </div>
          <Arrow />
        </Link>
      ))}
    </div>
  );
}
function ProjectList({ lang, items }: { lang: Locale; items: Project[] }) {
  const t = messages(lang);
  return (
    <div className="project-list">
      {items.map((p) => (
        <Link
          className="project-card"
          key={p.id}
          href={route(lang, `projects/${p.slug}`)}
        >
          <div className="project-meta">
            <span>{label(p.category, lang)}</span>
            <span className="status">
              {p.progress === 'completed'
                ? t.completed
                : p.progress === 'planned'
                  ? t.projectPlanned
                  : t.ongoing}
            </span>
          </div>
          <h3>{p.title[lang]}</h3>
          <p>{p.summary[lang]}</p>
          <span className="text-link">
            {t.readMore}
            <Arrow />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function HomePage({ lang }: { lang: Locale }) {
  const t = messages(lang);
  const recentNotes = notes(lang).slice(0, 3);
  return (
    <>
      <section className="home-cover" aria-labelledby="home-name">
        <PhotoCarousel
          lang={lang}
          photos={[
            {
              id: 'in-the-field',
              src: asset(profile.photo),
              alt: profile.photoAlt[lang],
              caption: profile.photoCaption[lang],
              width: 1824,
              height: 1368,
            },
            ...photos
              .filter((photo) => photo.showOnCover)
              .map((photo) => ({
                id: photo.slug,
                src: asset(`${photo.image}.jpg`),
                srcSet: photo.responsiveWidths
                  .map(
                    (width) =>
                      `${asset(`${photo.image}-${width}.webp`)} ${width}w`,
                  )
                  .join(', '),
                alt: photo.alt[lang],
                caption: photo.title[lang],
                width: photo.width,
                height: photo.height,
              })),
          ]}
        >
          <div className="cover-copy container">
            <p className="cover-eyebrow">
              {lang === 'en' ? 'A personal academic space' : '个人学术主页'}
            </p>
            <h1 id="home-name">{profile.name[lang]}</h1>
            <p className="cover-title">{profile.title[lang]}</p>
            <p className="cover-affiliation">
              {profile.university[lang]}
              <span> · </span>
              {profile.role[lang]}
            </p>
            <div className="hero-actions">
              <Link
                className="button button-primary"
                href={route(lang, 'research')}
              >
                {t.viewResearch}
                <Arrow />
              </Link>
              <Link
                className="button button-secondary"
                href={route(lang, 'contact')}
              >
                {t.viewContact}
              </Link>
              <CV lang={lang} />
            </div>
          </div>
        </PhotoCarousel>
      </section>
      <section className="home-introduction container">
        <div>
          <p className="eyebrow">
            {lang === 'en' ? 'A little about me' : '关于我'}
          </p>
          <h2>
            {lang === 'en'
              ? 'Curiosity across disciplines.'
              : '从好奇出发，跨越学科。'}
          </h2>
          <TextLink href={route(lang, 'about')}>{t.aboutMe}</TextLink>
        </div>
        <div className="introduction-copy">
          <p>{profile.intro[lang]}</p>
          <p>{profile.interestsIntro[lang]}</p>
        </div>
      </section>
      <div className="container">
        <div className="focus-strip">
          <div>
            <p className="eyebrow">{t.currently}</p>
            <p>{profile.now[lang]}</p>
          </div>
          <div>
            <p className="eyebrow">{t.next}</p>
            <p>{profile.next[lang]}</p>
          </div>
          <ResearchGraph
            compact
            items={research.map((item) => ({
              id: item.id,
              title: item.title[lang],
            }))}
          />
        </div>
      </div>
      <section className="home-section container">
        <ResearchShowcase className="home-research">
          <div className="research-overview">
            <SectionHeading
              label={t.researchLabel}
              title={t.researchHeading}
              href={route(lang, 'research')}
              link={t.allResearch}
            />
            <ResearchGraph
              items={research.map((item) => ({
                id: item.id,
                title: item.title[lang],
              }))}
            />
          </div>
          <ResearchCards lang={lang} />
        </ResearchShowcase>
      </section>
      <section className="learning-band">
        <div className="home-section container">
          <SectionHeading
            label={t.learningLabel}
            title={t.learningHeading}
            href={route(lang, 'learning')}
            link={t.allLearning}
          />
          <LearningCards lang={lang} />
        </div>
      </section>
      <div className="container">
        {(projects.length > 0 || recentNotes.length > 0) && (
          <div className="archive-grid">
            {projects.length > 0 && (
              <section className="home-section">
                <SectionHeading
                  label={t.projectLabel}
                  title={t.projectHeading}
                />
                <ProjectList lang={lang} items={projects.slice(0, 2)} />
                <TextLink href={route(lang, 'projects')}>
                  {t.allProjects}
                </TextLink>
              </section>
            )}
            {recentNotes.length > 0 && (
              <section className="home-section">
                <SectionHeading label={t.notesLabel} title={t.notesHeading} />
                <NoteList lang={lang} items={recentNotes} />
                <TextLink href={route(lang, 'notes')}>{t.allNotes}</TextLink>
              </section>
            )}
          </div>
        )}
        <section className="home-section home-experience">
          <SectionHeading
            label={t.experienceLabel}
            title={t.experienceHeading}
            href={route(lang, 'experience')}
            link={t.allExperience}
          />
          <div className="experience-preview">
            {experience.slice(0, 2).map((e) => (
              <Link href={`${route(lang, 'experience')}#${e.id}`} key={e.id}>
                <span className="preview-date">{e.date[lang]}</span>
                <div>
                  <h3>{e.title[lang]}</h3>
                  <span>{e.type[lang]}</span>
                </div>
                <Arrow />
              </Link>
            ))}
          </div>
        </section>
        <ContactStrip lang={lang} />
      </div>
    </>
  );
}

export function SectionPage({
  lang,
  section,
}: {
  lang: Locale;
  section: Section;
}) {
  const t = messages(lang);
  const intros = {
    about: t.aboutIntro,
    research: t.researchIntro,
    learning: t.learningIntro,
    experience: t.experienceIntro,
    awards: t.awardsIntro,
    projects: t.projectIntro,
    notes: t.notesIntro,
    contact: t.contactPageIntro,
  };
  const title = section === 'learning' ? t.learningLabel : t.nav[section];
  const cv = (profile.cv as Record<Locale, string | null>)[lang];
  const academicProfiles = (
    [
      ['LinkedIn', profile.linkedin],
      ['Google Scholar', profile.scholar],
      ['ORCID', profile.orcid],
    ] as [string, string | null][]
  ).filter((entry): entry is [string, string] => Boolean(entry[1]));
  return (
    <div className={`container inner-page page-${section}`}>
      {section === 'research' ? (
        <ResearchShowcase className="research-feature research-graph-dark">
          <div className="research-feature-copy">
            <PageHeading
              label={t.eyebrow}
              title={title}
              intro={intros[section]}
            />
            <nav className="research-directions" aria-label={t.nav.research}>
              {research.map((item) => (
                <a
                  href={`#${item.id}`}
                  data-research-id={item.id}
                  key={item.id}
                >
                  <span className="item-number">{item.number}</span>
                  <span>{item.title[lang]}</span>
                  <Arrow />
                </a>
              ))}
            </nav>
          </div>
          <ResearchGraph
            items={research.map((item) => ({
              id: item.id,
              title: item.title[lang],
            }))}
          />
        </ResearchShowcase>
      ) : (
        <PageHeading label={t.eyebrow} title={title} intro={intros[section]} />
      )}
      {section === 'about' && (
        <>
          <div className="about-grid">
            <div>
              <section className="prose-section">
                <h2>{t.background}</h2>
                <p>{profile.intro[lang]}</p>
                <p>{profile.interestsIntro[lang]}</p>
                <p>{profile.motivation[lang]}</p>
              </section>
              <section className="education-block">
                <p className="eyebrow">{t.education}</p>
                <h2>{profile.university[lang]}</h2>
                <p>{profile.major[lang]}</p>
                <p>{profile.program[lang]}</p>
                <div>
                  <span>{profile.role[lang]}</span>
                  <span>
                    {profile.entryYear} — {profile.graduationYear} ({t.expected}
                    )
                  </span>
                </div>
              </section>
            </div>
            <figure className="about-photo">
              <div className="portrait-viewport">
                <img
                  src={asset(profile.photo)}
                  alt={profile.photoAlt[lang]}
                  width="1824"
                  height="1368"
                />
              </div>
              <figcaption>{profile.photoCaption[lang]}</figcaption>
            </figure>
          </div>
          <Skills lang={lang} />
          <section className="content-section">
            <h2>{t.related}</h2>
            <div className="related-links">
              {(['research', 'experience', 'awards'] as const).map((k) => (
                <TextLink key={k} href={route(lang, k)}>
                  {t.nav[k]}
                </TextLink>
              ))}
            </div>
          </section>
        </>
      )}
      {section === 'research' && (
        <>
          <div className="research-details">
            {research.map((item) => (
              <section id={item.id} className="research-detail" key={item.id}>
                <div className="research-side">
                  <span className="item-number">{item.number}</span>
                  <span className="status">{t.interestStatus}</span>
                </div>
                <div>
                  <h2>{item.title[lang]}</h2>
                  <p className="large-copy">{item.description[lang]}</p>
                  <div className="topic-tags">
                    {item.topics.map((topic) => (
                      <span key={topic}>{label(topic, lang)}</span>
                    ))}
                  </div>
                  <h3>{t.questions}</h3>
                  <ul className="question-list">
                    {item.questions[lang].map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
          {publications.length > 0 && (
            <section className="content-section publication-section">
              <h2>{t.publications}</h2>
              {publications.length ? (
                (
                  publications as {
                    title: Localized;
                    url: string;
                    authors: string;
                    status: string;
                  }[]
                ).map((p, i) => (
                  <article key={i}>
                    <h3>
                      <a href={p.url}>{p.title[lang]}</a>
                    </h3>
                    <p>
                      {p.authors} · {label(p.status, lang)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="muted">{t.publicationsEmpty}</p>
              )}
            </section>
          )}
          <div className="related-links">
            <TextLink href={route(lang, 'learning')}>{t.allLearning}</TextLink>
            {projects.length > 0 && (
              <TextLink href={route(lang, 'projects')}>
                {t.viewProjects}
              </TextLink>
            )}
          </div>
        </>
      )}
      {section === 'learning' && (
        <>
          <LearningCards lang={lang} full />
          <Skills lang={lang} />
          <div className="related-links">
            {notes(lang).length > 0 && (
              <TextLink href={route(lang, 'notes')}>{t.allNotes}</TextLink>
            )}
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              {t.github}
              <Arrow diagonal />
            </a>
          </div>
        </>
      )}
      {section === 'experience' && (
        <>
          <ExperienceBrowser
            label={t.nav.experience}
            items={experience.map((item) => ({
              id: item.id,
              date: item.date[lang],
              title: item.title[lang],
            }))}
          >
            <div className="timeline">
              {experience.map((item) => (
                <article className="timeline-item" id={item.id} key={item.id}>
                  <div className="timeline-date">{item.date[lang]}</div>
                  <div className="timeline-body">
                    <p className="eyebrow">{item.type[lang]}</p>
                    <h2>{item.title[lang]}</h2>
                    <p>{item.description[lang]}</p>
                  </div>
                </article>
              ))}
            </div>
          </ExperienceBrowser>
          <p className="small-note">{t.dateNote}</p>
        </>
      )}
      {section === 'awards' && (
        <>
          <div className="award-list">
            {awards.map((item) => (
              <article className="award-row" key={item.id}>
                <div className="award-emblem" aria-hidden="true">
                  <svg
                    width="29"
                    height="35"
                    viewBox="0 0 29 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  >
                    <circle cx="14.5" cy="11" r="8.5" />
                    <path d="m9 18-2 14 7.5-4 7.5 4-2-14M14.5 5l1.8 3.5 3.7.5-2.8 2.7.6 3.8-3.3-1.8-3.3 1.8.6-3.8L9 9l3.7-.5Z" />
                  </svg>
                </div>
                <div>
                  <p className="eyebrow">{item.category[lang]}</p>
                  <h2>{item.title[lang]}</h2>
                  <p>{item.organization[lang]}</p>
                </div>
                <div className="award-result">
                  <strong>{item.award[lang]}</strong>
                  <span>{item.year ?? t.yearPending}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="small-note">{t.awardNote}</p>
        </>
      )}
      {section === 'projects' && (
        <>
          <div className="archive-intro">
            <span className="eyebrow">{t.projectCategories}</span>
            <div className="topic-tags">
              {categories.projects.map((c) => (
                <span key={c}>{label(c, lang)}</span>
              ))}
            </div>
          </div>
          {projects.length ? (
            <ProjectList lang={lang} items={projects} />
          ) : (
            <EmptyState title={t.projectEmptyTitle} text={t.projectEmpty} />
          )}
          <div className="related-links">
            <TextLink href={route(lang, 'learning')}>{t.allLearning}</TextLink>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              {t.github}
              <Arrow diagonal />
            </a>
          </div>
        </>
      )}
      {section === 'notes' && (
        <>
          <div className="archive-intro">
            <span className="eyebrow">{t.notesCategories}</span>
            <div className="topic-tags">
              {categories.notes.map((c) => (
                <span key={c}>{label(c, lang)}</span>
              ))}
            </div>
          </div>
          {notes(lang).length ? (
            <NoteList lang={lang} items={notes(lang)} />
          ) : (
            <EmptyState title={t.notesEmptyTitle} text={t.notesEmpty} />
          )}
          <div className="related-links">
            <TextLink href={route(lang, 'learning')}>{t.allLearning}</TextLink>
          </div>
        </>
      )}
      {section === 'contact' && (
        <>
          <div className={`contact-page-grid${cv ? '' : ' without-cv'}`}>
            <div>
              <a className="contact-item" href={`mailto:${profile.email}`}>
                <span className="eyebrow">{t.email}</span>
                <strong>{profile.email}</strong>
                <Arrow diagonal />
              </a>
              <a
                className="contact-item"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                <span className="eyebrow">{t.githubLabel}</span>
                <strong>{profile.githubUsername}</strong>
                <Arrow diagonal />
              </a>
            </div>
            {cv && (
              <aside className="cv-panel">
                <p className="eyebrow">{t.cv}</p>
                <h2>{profile.name[lang]}</h2>
                <p>
                  {profile.role[lang]}
                  <br />
                  {profile.university[lang]}
                </p>
                <CV lang={lang} button />
              </aside>
            )}
          </div>
          {academicProfiles.length > 0 && (
            <section className="content-section">
              <h2>{t.otherProfiles}</h2>
              <div className="related-links">
                {academicProfiles.map(([label, url]) => (
                  <a
                    key={label}
                    className="text-link"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                    <Arrow diagonal />
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href?.startsWith('/') ? asset(href) : href}>{children}</a>
          ),
          img: ({ src, alt }) =>
            typeof src === 'string' ? (
              <img
                src={src.startsWith('/') ? asset(src) : src}
                alt={alt ?? ''}
                loading="lazy"
              />
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
export function NotePage({ note, lang }: { note: Note; lang: Locale }) {
  const t = messages(lang);
  return (
    <article className="container article-page">
      <TextLink href={route(lang, 'notes')}>{t.backNotes}</TextLink>
      <PageHeading
        label={`${label(note.category, lang)} / ${note.date}`}
        title={note.title}
        intro={note.summary}
      />
      <Markdown>{note.body}</Markdown>
    </article>
  );
}
export function TranslationPage({
  slug,
  lang,
  original,
}: {
  slug: string;
  lang: Locale;
  original: Locale;
}) {
  const t = messages(lang);
  return (
    <div className="container inner-page">
      <PageHeading
        label={t.notesLabel}
        title={lang === 'en' ? 'Translation forthcoming' : '译文待补充'}
        intro={t.original}
      />
      <TextLink href={route(original, `notes/${slug}`)}>
        {original === 'en' ? 'Read in English' : '阅读中文原文'}
      </TextLink>
    </div>
  );
}
export function ProjectPage({
  project: p,
  lang,
}: {
  project: Project;
  lang: Locale;
}) {
  const t = messages(lang);
  return (
    <article className="container article-page">
      <TextLink href={route(lang, 'projects')}>{t.backProjects}</TextLink>
      <PageHeading
        label={`${label(p.category, lang)} / ${p.progress === 'completed' ? t.completed : p.progress === 'planned' ? t.projectPlanned : t.ongoing}`}
        title={p.title[lang]}
        intro={p.summary[lang]}
      />
      <div className="related-links">
        {(
          [
            ['repository', p.repository],
            ['documentation', p.documentation],
            ['demo', p.demo],
          ] as const
        ).map(([key, url]) =>
          url ? (
            <a
              className="text-link"
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {t[key]}
              <Arrow diagonal />
            </a>
          ) : null,
        )}
      </div>
      <section className="prose-section">
        <h2>{t.contribution}</h2>
        <p>{p.contribution[lang]}</p>
        {p.methods && (
          <>
            <h2>{t.methods}</h2>
            <p>{p.methods[lang]}</p>
          </>
        )}
        {p.results && (
          <>
            <h2>{t.results}</h2>
            <p>{p.results[lang]}</p>
          </>
        )}
      </section>
      <Markdown>{projectBody(p.slug, lang)}</Markdown>
    </article>
  );
}
