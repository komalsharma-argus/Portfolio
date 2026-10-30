const fs = require('fs');
const path = require('path');
const {ORDER} = require('./book-order');

const SRC = 'docs';
const OUT = 'generated-docs';
const ASSETS = path.join('static', 'book-assets');
const NUMBER_PREFIX = /^\d+\s*[-_.]+\s*/; // Docusaurus drops these from ids and URLs
const INDEX_NAMES = ['readme', 'index'];
const FENCE = /^\s*(```|~~~)/;

const natural = (a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
const isDoc = (f) => /\.mdx?$/.test(f);
const stripExt = (f) => f.replace(/\.mdx?$/, '');

fs.rmSync(OUT, {recursive: true, force: true});
fs.rmSync(ASSETS, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});

// ordered children of a folder
function children(rel) {
  const entries = fs.readdirSync(path.join(SRC, rel), {withFileTypes: true});
  const items = [
    ...entries.filter((e) => e.isDirectory()).map((e) => ({type: 'dir', name: e.name})),
    ...entries
      .filter((e) => e.isFile() && isDoc(e.name))
      .map((e) => ({type: 'doc', name: stripExt(e.name), file: e.name})),
  ].map((i) => ({...i, rel: rel ? `${rel}/${i.name}` : i.name}));

  const listed = ORDER[rel] || [];
  listed
    .filter((n) => !items.some((i) => i.name === n))
    .forEach((n) => console.warn(`Not found: ${rel}/${n}`));
  const rank = (i) => {
    const k = listed.indexOf(i.name);
    return k === -1 ? Infinity : k;
  };
  return items.sort((a, b) => rank(a) - rank(b) || natural(a.name, b.name));
}

function countDocs(rel) {
  return children(rel).reduce((n, i) => n + (i.type === 'doc' ? 1 : countDocs(i.rel)), 0);
}

function soleDoc(rel) {
  for (const k of children(rel)) {
    if (k.type === 'doc') return {file: k.file, dir: rel};
    const found = countDocs(k.rel) === 1 ? soleDoc(k.rel) : null;
    if (found) return found;
  }
  return null;
}

const indexDoc = (rel, kids) =>
  kids.find(
    (k) =>
      k.type === 'doc' &&
      (INDEX_NAMES.includes(k.name.toLowerCase()) || k.name.toLowerCase() === path.basename(rel).toLowerCase()),
  );

// images: copy next to the site and point the markdown at the copy
function assetUrl(folder, url) {
  if (/^(https?:|data:|mailto:|#|\/)/i.test(url)) return url;
  let plain = url;
  try {
    plain = decodeURIComponent(url);
  } catch {
    // keep as is
  }
  const target = path.posix.normalize(path.posix.join(folder, plain.split(/[?#]/)[0]));
  const src = path.join(SRC, target);
  if (!fs.existsSync(src) || !fs.statSync(src).isFile()) return url;
  const safe = target.split('/').map((s) => s.replace(/[^A-Za-z0-9._-]+/g, '-')).join('/');
  const dest = path.join(ASSETS, safe);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.copyFileSync(src, dest);
  return `/book-assets/${safe}`;
}

function fixImages(line, folder) {
  return line
    .replace(/!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)(\s+"[^"]*")?\s*\)/g, (m, alt, raw, title = '') => {
      const url = raw.startsWith('<') ? raw.slice(1, -1) : raw;
      const next = assetUrl(folder, url);
      return next === url ? m : `![${alt}](${next}${title})`;
    })
    .replace(/(<img\b[^>]*?\bsrc=)(["'])([^"']+)\2/gi, (m, pre, q, url) => `${pre}${q}${assetUrl(folder, url)}${q}`);
}

// the text of one topic, with its headings moved below the topic heading (level `depth`)
function bodyOf(file, folder, depth) {
  let src = fs.readFileSync(path.join(SRC, folder, file), 'utf8').replace(/\r\n/g, '\n');
  src = src.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = src.split('\n');

  let fence = false;
  const marks = [];
  lines.forEach((line, i) => {
    if (FENCE.test(line)) {
      fence = !fence;
      return;
    }
    const m = !fence && line.match(/^(#{1,6})\s+\S/);
    if (m) marks.push({i, level: m[1].length});
  });

  // a leading "# Title" is dropped: the folder-name heading replaces it
  const first = lines.findIndex((l) => l.trim() !== '');
  if (first !== -1 && marks.length && marks[0].i === first && marks[0].level === 1) {
    lines.splice(first, 1);
    marks.shift();
    marks.forEach((x) => {
      x.i -= 1;
    });
  }

  const min = marks.length ? Math.min(...marks.map((m) => m.level)) : 1;
  const shift = depth + 1 - min;
  marks.forEach(({i, level}) => {
    const next = Math.min(6, Math.max(depth + 1, level + shift));
    lines[i] = lines[i].replace(/^#{1,6}/, '#'.repeat(next));
  });

  fence = false;
  return lines
    .map((line) => {
      if (FENCE.test(line)) {
        fence = !fence;
        return line;
      }
      return fence ? line : fixImages(line, folder);
    })
    .join('\n')
    .trim();
}

const heading = (level, text) => `${'#'.repeat(Math.min(6, level))} ${text}`;

// everything inside a folder whose own heading is at level `depth`
function render(rel, depth) {
  const kids = children(rel);
  const idx = indexDoc(rel, kids);
  const parts = [];
  if (idx) parts.push(bodyOf(idx.file, rel, depth));
  kids
    .filter((k) => k !== idx)
    .forEach((k) => {
      if (k.type === 'doc') {
        parts.push(heading(depth + 1, k.name), bodyOf(k.file, rel, depth + 1));
      } else if (countDocs(k.rel) === 1) {
        const only = soleDoc(k.rel); // a folder holding one topic: the folder name is the topic heading
        parts.push(heading(depth + 1, k.name), bodyOf(only.file, only.dir, depth + 1));
      } else {
        parts.push(heading(depth + 1, k.name), render(k.rel, depth + 1));
      }
    });
  return parts.filter(Boolean).join('\n\n');
}

const chapters = [];
let n = 0;
children('').forEach((item) => {
  if (item.type === 'doc') {
    fs.copyFileSync(path.join(SRC, item.file), path.join(OUT, item.file)); // intro.mdx and similar
    return;
  }
  if (countDocs(item.rel) === 0) {
    console.warn(`Skipping ${item.name}: no markdown files`);
    return;
  }
  n += 1;
  const key = item.name.replace(NUMBER_PREFIX, '');
  const front = ['---', `title: ${JSON.stringify(item.name)}`, `sidebar_position: ${n}`, 'toc_max_heading_level: 4', '---'].join('\n');
  fs.writeFileSync(path.join(OUT, `${key}.md`), `${front}\n\n# ${item.name}\n\n${render(item.rel, 1)}\n`);
  chapters.push({number: n, key, title: item.name, link: `/docs/${key}`});
});

fs.mkdirSync('src/data', {recursive: true});
fs.writeFileSync('src/data/chapters.json', `${JSON.stringify(chapters, null, 2)}\n`);
console.log(`book: ${chapters.length} chapters -> ${OUT}`);