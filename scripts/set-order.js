const fs = require('fs');
const path = require('path');

const DOCS = 'docs';

const ORDER = {
  '': ['PostgreSQL', 'JavaScript', 'npm', 'NodeJS', 'React', 'Git & GitHub', 'Yarn', 'Webpack', '2025-OWASP-Top-10', 'AZ-900-Ms-Azure-Fundamentals'],
  'JavaScript': [
    'Basics', 'this Keyword', 'call, apply & bind', 'Functional Programming', 'Callback & Promises',
    'Debouncing', 'Throttling', 'DOM & DOM Manipulation', 'async & defer attributes',
    'local storage & session storage', 'Object Oriented JS', 'Nullish coalescing',
    'Optional chaining', 'Regular Expressions', 'Set Data Structure',
  ],
  'JavaScript/Basics': ['Arrays', 'Strings', 'Loops', 'Functions', 'Callback Function', 'Closures', 'setTimeout', 'setInterval'],
  'JavaScript/Callback & Promises': ['Promise', 'Promise APIs', 'Async & Await'],
  'JavaScript/DOM & DOM Manipulation': ['Accessing & Modifying DOM elements', 'Event Bubbling, Capturing aka Trickling', 'Event Delegation'],
  'JavaScript/Functional Programming': ['Currying', 'Higher Order Functions'],
  'JavaScript/Object Oriented JS': [
    'Object literal, Constructors', 'Object prototype', 'Prototype inheritance',
    'ES6 Classes & Inheritance', 'Object Destructuring', 'Built-in Static Object Methods',
  ],
  'React': ['Core Fundamentals', 'Component Architecture', 'React Hooks', 'Performance & Rendering'],
  'PostgreSQL': ['Notes', 'pgExercises'],
  'PostgreSQL/Notes': ['Order Of CLAUSES', 'AGGREGATE Functions', 'EXTRACT & CASE', 'GENERATE_SERIES', 'TO_CHAR, TRIM', 'ROLL_UP', 'WINDOW Functions'],
  'PostgreSQL/pgExercises': ['Basic-Queries', 'BasicQueriesSchemaMetadata', 'Joins&SubQueries', 'ModifyingData', 'Aggregation', 'Date', 'String', 'Recursive'],
};

const LABELS = {
  'NodeJS': 'Node.js',
  '2025-OWASP-Top-10': 'OWASP Top 10 (2025)',
  'AZ-900-Ms-Azure-Fundamentals': 'AZ-900: Azure Fundamentals',
};

const chapters = [];

const hasIndexDoc = (relPath) => {
  const base = path.basename(relPath).toLowerCase();
  return fs
    .readdirSync(path.join(DOCS, relPath))
    .some((f) => /\.mdx?$/.test(f) && ['readme', 'index', base].includes(f.replace(/\.mdx?$/, '').toLowerCase()));
};
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

function setPosition(file, pos) {
  let src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (m) {
    const fm = /^sidebar_position:.*$/m.test(m[1])
      ? m[1].replace(/^sidebar_position:.*$/m, () => `sidebar_position: ${pos}`)
      : `${m[1]}\nsidebar_position: ${pos}`;
    src = src.replace(m[0], () => `---\n${fm}\n---`);
  } else {
    src = `---\nsidebar_position: ${pos}\n---\n\n${src}`;
  }
  fs.writeFileSync(file, src);
}

function walk(rel) {
  const abs = path.join(DOCS, rel);
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const docs = entries.filter((e) => e.isFile() && /\.mdx?$/.test(e.name)).map((e) => e.name);
  const docName = (f) => f.replace(/\.mdx?$/, '');
  const names = [...dirs, ...docs.map(docName)];

  const listed = ORDER[rel] || [];
  listed.filter((n) => !names.includes(n)).forEach((n) => console.warn(`Not found: ${rel}/${n}`));
  const sorted = [
    ...listed.filter((n) => names.includes(n)),
    ...names.filter((n) => !listed.includes(n)).sort(natural),
  ];

  const folderName = path.basename(rel).toLowerCase();
  sorted.forEach((name, i) => {
    const position = i + 1;
    const childRel = rel ? `${rel}/${name}` : name;
      if (dirs.includes(name)) {
      const json = { position };
      if (LABELS[childRel]) json.label = LABELS[childRel];
      if (rel === '') {
        const key = name.replace(/^\d+\s*[-_.]+\s*/, ''); // Docusaurus drops number prefixes from URLs
        const hasLanding = hasIndexDoc(childRel);
        const slug = slugify(key);
        if (!hasLanding) json.link = { type: 'generated-index', slug: `/overview/${slug}` };
        chapters.push({
          number: chapters.length + 1,
          key,
          title: LABELS[childRel] || key,
          link: hasLanding ? `/docs/${key}` : `/docs/overview/${slug}`,
        });
      }
      fs.writeFileSync(path.join(DOCS, childRel, '_category_.json'), JSON.stringify(json, null, 2) + '\n');
      walk(childRel);
    }
  });
}

walk('');
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/chapters.json', JSON.stringify(chapters, null, 2) + '\n');