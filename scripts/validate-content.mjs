import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(root, 'data', `${name}.json`), 'utf8'));
const errors = [];
const assert = (ok, message) => {
  if (!ok) errors.push(message);
};
const localized = (value) =>
  value &&
  typeof value.en === 'string' &&
  value.en.trim() &&
  typeof value.zh === 'string' &&
  value.zh.trim();
const validDate = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().startsWith(value);
const validURL = (value) => {
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const profile = read('profile');
for (const key of [
  'name',
  'title',
  'university',
  'major',
  'program',
  'role',
  'intro',
  'interestsIntro',
  'motivation',
  'now',
  'next',
  'photoAlt',
  'photoCaption',
])
  assert(
    localized(profile[key]),
    `profile.${key}: English and Chinese text required`,
  );
assert(validDate(profile.updatedAt), 'profile.updatedAt: use YYYY-MM-DD');
assert(validURL(profile.github), 'profile.github: valid URL required');
for (const key of ['linkedin', 'scholar', 'orcid'])
  if (profile[key])
    assert(validURL(profile[key]), `profile.${key}: valid URL required`);
for (const item of [profile.photo, ...Object.values(profile.cv)].filter(
  Boolean,
))
  assert(
    typeof item === 'string' &&
      item.startsWith('/') &&
      fs.existsSync(path.join(root, 'public', item)),
    `Missing public asset: ${item}`,
  );
const categories = read('categories');
const cover = read('cover-photo');
assert(slugPattern.test(cover.id ?? ''), 'Cover: stable ID required');
for (const key of ['alt', 'caption'])
  assert(localized(cover[key]), `Cover: bilingual ${key} required`);
assert(
  Number.isInteger(cover.width) &&
    cover.width > 0 &&
    Number.isInteger(cover.height) &&
    cover.height > 0,
  'Cover: positive original dimensions required',
);
assert(
  typeof cover.image === 'string' &&
    /^\/images\/covers\/[a-z0-9-]+$/.test(cover.image),
  'Cover: invalid image prefix',
);
assert(
  typeof cover.sizes === 'string' && cover.sizes.trim(),
  'Cover: responsive sizes required',
);
assert(
  Array.isArray(cover.responsiveWidths) &&
    cover.responsiveWidths.length > 0 &&
    cover.responsiveWidths.every(
      (width, index, widths) =>
        Number.isInteger(width) &&
        width > 0 &&
        width <= cover.width &&
        (index === 0 || width > widths[index - 1]),
    ),
  'Cover: responsive widths must be ascending and must not upscale the source',
);
for (const suffix of [
  '.jpg',
  ...(cover.responsiveWidths ?? []).map((width) => `-${width}.webp`),
])
  assert(
    fs.existsSync(path.join(root, 'public', `${cover.image}${suffix}`)),
    `Cover: missing ${suffix} asset`,
  );
const photoSlugs = new Set();
for (const photo of read('photos')) {
  assert(
    slugPattern.test(photo.slug ?? '') && !photoSlugs.has(photo.slug),
    `Photo: invalid or duplicate slug ${photo.slug}`,
  );
  photoSlugs.add(photo.slug);
  assert(
    typeof photo.showOnCover === 'boolean',
    `Photo ${photo.slug}: showOnCover must be true or false`,
  );
  for (const key of ['title', 'caption', 'alt'])
    assert(
      localized(photo[key]),
      `Photo ${photo.slug}: bilingual ${key} required`,
    );
  assert(
    Number.isInteger(photo.width) &&
      photo.width > 0 &&
      Number.isInteger(photo.height) &&
      photo.height > 0,
    `Photo ${photo.slug}: positive image dimensions required`,
  );
  assert(
    typeof photo.image === 'string' &&
      /^\/images\/photos\/[a-z0-9-]+$/.test(photo.image),
    `Photo ${photo.slug}: invalid image prefix`,
  );
  assert(
    Array.isArray(photo.responsiveWidths) &&
      photo.responsiveWidths.length > 0 &&
      photo.responsiveWidths.every(
        (width, index, widths) =>
          Number.isInteger(width) &&
          width > 0 &&
          (index === 0 || width > widths[index - 1]),
      ),
    `Photo ${photo.slug}: responsiveWidths must be unique, ascending positive integers`,
  );
  for (const suffix of [
    '.jpg',
    ...photo.responsiveWidths.map((width) => `-${width}.webp`),
  ])
    assert(
      fs.existsSync(path.join(root, 'public', `${photo.image}${suffix}`)),
      `Photo ${photo.slug}: missing ${suffix} asset`,
    );
}
const seenProjects = new Set();
for (const project of read('projects')) {
  assert(
    ['draft', 'published', 'archived'].includes(project.status),
    `Project ${project.id}: invalid publication status`,
  );
  if (project.status !== 'published') continue;
  assert(
    slugPattern.test(project.slug ?? ''),
    `Project ${project.id}: invalid slug`,
  );
  assert(
    !seenProjects.has(project.slug),
    `Duplicate project slug: ${project.slug}`,
  );
  seenProjects.add(project.slug);
  for (const key of ['title', 'summary', 'contribution'])
    assert(
      localized(project[key]),
      `Project ${project.id}: bilingual ${key} required`,
    );
  assert(
    ['planned', 'ongoing', 'completed'].includes(project.progress),
    `Project ${project.id}: invalid progress`,
  );
  assert(
    categories.projects.includes(project.category),
    `Project ${project.id}: unknown category`,
  );
  assert(
    validDate(project.updatedAt),
    `Project ${project.id}: valid updatedAt required`,
  );
  for (const key of ['repository', 'documentation', 'demo'])
    if (project[key])
      assert(
        validURL(project[key]),
        `Project ${project.id}: invalid ${key} URL`,
      );
}
const seenNotes = new Set();
let publishedNotes = 0;
for (const file of fs
  .readdirSync(path.join(root, 'content', 'notes'))
  .filter((f) => f.endsWith('.md'))) {
  const { data, content } = matter(
    fs.readFileSync(path.join(root, 'content', 'notes', file), 'utf8'),
  );
  assert(
    ['draft', 'published', 'archived'].includes(data.status),
    `${file}: status required`,
  );
  if (data.status !== 'published') continue;
  assert(['en', 'zh'].includes(data.lang), `${file}: en or zh locale required`);
  assert(slugPattern.test(data.slug ?? ''), `${file}: invalid slug`);
  assert(
    typeof data.title === 'string' && data.title.trim(),
    `${file}: title required`,
  );
  assert(
    typeof data.summary === 'string' && data.summary.trim(),
    `${file}: summary required`,
  );
  assert(
    validDate(data.date),
    `${file}: date must be a quoted YYYY-MM-DD string`,
  );
  assert(categories.notes.includes(data.category), `${file}: unknown category`);
  assert(content.trim().length > 0, `${file}: published note needs a body`);
  const id = `${data.lang}/${data.slug}`;
  assert(!seenNotes.has(id), `Duplicate note: ${id}`);
  seenNotes.add(id);
  publishedNotes++;
}
for (const file of ['research', 'learning', 'experience', 'awards']) {
  const seen = new Set();
  for (const record of read(file)) {
    assert(
      record.id && !seen.has(record.id),
      `${file}: missing or duplicate ID`,
    );
    seen.add(record.id);
    assert(
      localized(record.title),
      `${file}.${record.id}: bilingual title required`,
    );
  }
}
for (const pub of read('publications')) {
  assert(localized(pub.title), 'Publication requires bilingual title');
  assert(validURL(pub.url), 'Publication requires valid URL');
  assert(
    typeof pub.authors === 'string' && pub.authors.trim(),
    'Publication requires authors',
  );
  assert(
    ['Submitted', 'Preprint', 'Accepted', 'Published'].includes(pub.status),
    'Publication requires accurate status',
  );
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Content valid: 2 languages, ${seenProjects.size} published projects, ${publishedNotes} published notes. Unfilled items remain in data/todos.json.`,
);
