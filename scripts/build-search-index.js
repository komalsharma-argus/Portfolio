const fs = require('fs');
const path = require('path');
const chapters = require('../src/data/chapters.json');

const DOCS = 'generated-docs';
const OUT = path.join('static', 'search-index.json');

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

const entries = [];

fs.readdirSync(DOCS)
  .filter((f) => /\.mdx?$/.test(f))
  .forEach((file) => {
    const id = file.replace(/\.mdx?$/, '');
    const ch = chapters.find((c) => c.key === id);
    let src = fs.readFileSync(path.join(DOCS, file), 'utf8').replace(/\r\n/g, '\n');
    const fm = src.match(/^---\n([\s\S]*?)\n---\n?/);
    if (fm) src = src.slice(fm[0].length);
    const fmTitle = fm ? ((fm[1].match(/^title:\s*(.+)$/m) || [])[1] || '').replace(/^["']|["']$/g, '') : '';
    const fallbackTopic = ch ? ch.title : fmTitle || id;

    const sections = [];
    const used = new Map();
    const stack = [];
    let cur = {heading: '', anchor: '', topic: '', lines: []};
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
      const level = h[1].length;
      let text = inlineText(h[2]);
      let anchor;
      const custom = text.match(/\s*\{#([^}]+)\}\s*$/);
      if (custom) {
        anchor = custom[1];
        text = text.replace(custom[0], '');
      } else {
        const base = slugify(text);
        const count = used.get(base) || 0;
        used.set(base, count + 1);
        anchor = count ? `${base}-${count}` : base;
      }
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      const topic = stack.slice(1).map((s) => s.text).join(' › ');
      stack.push({level, text});
      sections.push(cur);
      cur = {heading: text, anchor, topic, lines: []};
    }
    sections.push(cur);

    sections.forEach((s) => {
      const text = clean(s.lines).slice(0, 8000);
      if (!s.heading && !text) return;
      entries.push({
        id,
        chapter: ch ? ch.key : '',
        chapterTitle: ch ? ch.title : 'Book',
        topic: s.topic || fallbackTopic,
        heading: s.heading,
        anchor: s.anchor,
        text,
      });
    });
  });

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`search index: ${entries.length} sections -> ${OUT}`);