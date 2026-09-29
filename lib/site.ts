import type { Metadata } from 'next';
import profile from '@/data/profile.json';
import coverPhoto from '@/data/cover-photo.json';
import en from '@/messages/en.json';
import zh from '@/messages/zh.json';
import zhLabels from '@/messages/labels.zh.json';

export type Locale = 'en' | 'zh';
export type Localized<T = string> = Record<Locale, T>;
export const locales: Locale[] = ['en', 'zh'];
export const sections = [
  'about',
  'research',
  'learning',
  'experience',
  'awards',
  'projects',
  'notes',
  'contact',
] as const;
export type Section = (typeof sections)[number];
export const isLocale = (lang: string): lang is Locale =>
  locales.includes(lang as Locale);
export const messages = (lang: Locale) => (lang === 'zh' ? zh : en);
export const label = (text: string, lang: Locale) =>
  lang === 'zh' ? ((zhLabels as Record<string, string>)[text] ?? text) : text;
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(
  /\/$/,
  '',
);
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wesweswes7.github.io'
).replace(/\/$/, '');
export const asset = (path: string) => `${basePath}${path}`;
export const route = (lang: Locale, path = '') =>
  `/${lang}/${path ? `${path.replace(/^\/+|\/+$/g, '')}/` : ''}`;
export const absolute = (path: string) => `${siteOrigin}${basePath}${path}`;
export function metadata(
  lang: Locale,
  title?: string,
  path = '',
  description?: string,
): Metadata {
  const url = absolute(route(lang, path));
  const name = title
    ? `${title} | Zhongsheng Luo`
    : 'Zhongsheng Luo | AI & Computational Social Science';
  const desc =
    description ?? `${profile.intro[lang]} ${profile.interestsIntro[lang]}`;
  const shareImage = {
    url: absolute(`${coverPhoto.image}-share.jpg`),
    width: 1200,
    height: 630,
    alt: coverPhoto.alt[lang],
  };
  return {
    title: name,
    description: desc,
    authors: [{ name: profile.englishName }],
    alternates: {
      canonical: url,
      languages: {
        en: absolute(route('en', path)),
        'zh-CN': absolute(route('zh', path)),
        'x-default': absolute(route('en', path)),
      },
    },
    openGraph: {
      title: name,
      description: desc,
      url,
      siteName: profile.englishName,
      type: 'website',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: desc,
      images: [shareImage],
    },
  };
}
