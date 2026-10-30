const fs = require('fs');
const path = require('path');

const DOCS = 'docs';
const OUT = path.join('static', 'search-index.json');
const NUMBER_PREFIX = /^\d+\s*[-_.]+\s*/; // Docusaurus drops these from ids and URLs
const INDEX_NAMES = ['readme', 'index'];

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.mdx?$/.test(e.name)) files.push(full);
  }
})(DOCS);

const relFiles = files.map((f) => path.relative(DOCS, f).split(path.sep).join('/'));
const countUnder = (folder) => relFiles.filter((r) => r.startsWith(`${folder}/`)).length;

// same ids Docusaurus gives headings (github-slugger style)
const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '').replace(/ /g, '-');

const inlineText = (s) =>
  s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<\/?[A-Za-z][^>]*>/g, '')
    .replace(/[`*~]/g, '')
    .replace(/(^|\s)_+([^_]+)_+(?=\s|$)/g, '$1$2')
    .trim();

function clean(lines) {
  let fence = false;
  const out = [];
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) {
      out.push(line); // code is kept as written
      continue;
    }
    out.push(
      line
        .replace(/^\s*(import|export)\s.+$/, '')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/, '')
        .replace(/\|/g, ' ')
        .replace(/[*~`]+/g, ''),
    );
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

function parse(file) {
  let src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  let fm = '';
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m) {
    fm = m[1];
    src = src.slice(m[0].length);
  }
  const fmId = (fm.match(/^id:\s*(.+)$/m) || [])[1]?.replace(/^["']|["']$/g, '').trim();
  const title = (fm.match(/^title:\s*(.+)$/m) || [])[1]?.replace(/^["']|["']$/g, '').trim();

  const sections = [];
  const used = new Map();
  let cur = {heading: '', anchor: '', lines: []};
  let fence = false;

  for (const line of src.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      cur.lines.push(line);
      continue;
    }
    const h = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!h) {
      cur.lines.push(line);
      continue;
    }
    let text = inlineText(h[2]);
    let anchor;
    const custom = text.match(/\s*\{#([^}]+)\}\s*$/);
    if (custom) {
      anchor = custom[1];
      text = text.replace(custom[0], '');
    } else {
      const base = slugify(text);
      const n = used.get(base) || 0;
      used.set(base, n + 1);
      anchor = n ? `${base}-${n}` : base;
    }
    if (h[1].length <= 3) {
      sections.push(cur);
      cur = {heading: text, anchor, lines: []}; // new section at h1-h3
    } else {
      cur.lines.push(text); // deeper headings stay inside their section
    }
  }
  sections.push(cur);
  return {title, fmId, sections};
}

const entries = [];
files.forEach((file, i) => {
  const parts = relFiles[i].replace(/\.mdx?$/, '').split('/');
  const fileName = parts.pop();
  const dirs = parts;
  const {title, fmId, sections} = parse(file);

  const idSegs = [...dirs, fileName].map((s) => s.replace(NUMBER_PREFIX, ''));
  if (fmId) idSegs[idSegs.length - 1] = fmId;
  const id = idSegs.join('/');

  // folder names are the names shown (a file only stands in when it has no folder of its own)
  const parent = dirs[dirs.length - 1];
  const standsForFolder =
    parent && (INDEX_NAMES.includes(fileName.toLowerCase()) || fileName.toLowerCase() === parent.toLowerCase());
  const sole = dirs.length > 0 && countUnder(dirs.join('/')) === 1;
  const names = standsForFolder || sole ? dirs : [...dirs, fileName];

  const chapter = dirs.length ? dirs[0].replace(NUMBER_PREFIX, '') : '';
  const chapterTitle = dirs.length ? dirs[0] : 'Book';
  const topic = dirs.length ? names.slice(1).join(' › ') || dirs[0] : title || fileName;

  sections.forEach((s) => {
    const text = clean(s.lines).slice(0, 8000);
    if (!s.heading && !text) return;
    entries.push({id, chapter, chapterTitle, topic, heading: s.heading, anchor: s.anchor, text});
  });
});

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`search index: ${entries.length} sections from ${files.length} docs -> ${OUT}`);