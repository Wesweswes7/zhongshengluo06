# Zhongsheng Luo · Personal Website

A bilingual academic portfolio for Zhongsheng Luo (罗中圣), an undergraduate at Central China Normal University. Built with Next.js App Router and TypeScript, with static export for GitHub Pages.

[English homepage](https://wesweswes7.github.io/zhongshengluo06/en/) · [中文主页](https://wesweswes7.github.io/zhongshengluo06/zh/)

The repository has been renamed to [Wesweswes7/zhongshengluo06](https://github.com/Wesweswes7/zhongshengluo06). The links above are the new project-site deployment targets; publication and live verification are in progress.

English is the default language. All nine core pages have Chinese counterparts. The homepage opens with the selected study-space portrait, followed by the original conference photograph and the waterside photograph in the manual carousel. The podium photograph remains excluded from the cover. The homepage network links directly to the three existing research sections; their full content stays on the Research page.

## Run locally

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Open the local address printed by Next.js. `/en/` and `/zh/` are the language entry points; `/` displays the English homepage.

## Build and preview

```sh
npm run build
npm run preview
```

The production output is in `out/`. The preview server normally uses port 4173. The build validates content before exporting the site. A type check can also be run with `npm run typecheck`.

## Content and documentation

- [内容维护指南（中文）](docs/CONTENT.zh-CN.md)
- [GitHub Pages 部署指南（中文）](docs/DEPLOYMENT.zh-CN.md)
- [Profile README draft](github-profile/README.md) · [中文版本](github-profile/README.zh-CN.md)
- [Repository organization](docs/REPOSITORIES.md)
- [Validation record](docs/VALIDATION.md)
- [Note template](docs/templates/note.md) · [Project template](docs/templates/project.json)

Structured content lives in `data/`; navigation and UI translations live in `messages/`. Long-form notes live in `content/notes/`, and optional project narratives live in `content/projects/`.

The homepage-only default photograph is configured in `data/cover-photo.json`, independently of the About portrait in `data/profile.json`. WebP variants and a JPEG fallback live in `public/images/covers/`. To reproduce the current exports from the supplied 1672×941 source, run `node scripts/prepare-cover-photo.mjs "<source-image-path>"`. This uses the existing Sharp installation and only resizes/encodes at the original aspect ratio; it does not crop, retouch, or upscale. Content validation checks that every configured cover resource exists.

## Current content

The site contains the supplied education, interests, learning subjects, experiences, and awards. There are no invented projects, publications, or completed learning milestones. Missing CVs, role details, award years, and social profiles remain explicit pending items. See `data/todos.json`.

Project and note entry points appear automatically after content is published in the corresponding language. Empty archives retain their existing URLs, but are omitted from navigation and the sitemap and marked `noindex`. CV and academic profile panels appear only when their links are available. Draft and archived projects and notes are excluded from public lists.

The homepage prioritizes research interests and contact. Shared styles are inlined to remove a render-blocking request, and supporting browsers prepare internal pages on hover or touch intent using native document prefetch/prerender rules. Standard links remain usable when speculation is unavailable. Only the active language's navigation labels are sent to the navigation component.

## Deployment

The website repository is [Wesweswes7/zhongshengluo06](https://github.com/Wesweswes7/zhongshengluo06), renamed from `personal-website`. Its deployment target is [the new project site](https://wesweswes7.github.io/zhongshengluo06/). The included GitHub Actions workflow builds and deploys on pushes to `main`, using GitHub Actions as the Pages source. It reads the origin and base path from GitHub's Pages configuration. After the rename, rerun the workflow and verify the new project URLs.

For a manual production build, set `NEXT_PUBLIC_SITE_URL` to `https://wesweswes7.github.io` and `NEXT_PUBLIC_BASE_PATH` to `/zhongshengluo06`, then preview with `npm run preview -- --base /zhongshengluo06`. Both values take effect **before building**. Local development needs neither variable.

GitHub redirects the old repository URL after a rename, but it does not automatically redirect the old Pages project URLs. Update bookmarks and shared website, image, and CV links from `/personal-website/` to `/zhongshengluo06/` after the new deployment is verified.

## Showcase

The homepage introduces the author's identity, current learning, future exploration, and research interests. Research, Learning, About, Experience, Awards, Projects, Notes, and Contact provide the full archive.

## Rights

The personal photograph and biographical content are supplied for this website. No blanket open-source license has been applied to them. Choose an appropriate license for reusable code separately before external reuse.
