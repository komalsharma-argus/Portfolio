import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import chapters from '@site/src/data/chapters.json';
import styles from './BookBreadcrumbs.module.css';

const clean = (p) => {
  let s = p;
  try {
    s = decodeURI(p);
  } catch {
    // handle errors
  }
  return s.length > 1 ? s.replace(/\/+$/, '') : s;
};

// the page for a folder or doc, if there is one (README / index / same-name doc)
const pageFor = (path, docs) => {
  const base = path.toLowerCase();
  const last = base.split('/').pop();
  const hit = docs.find((d) => {
    const id = d.id.toLowerCase();
    return id === base || id === `${base}/readme` || id === `${base}/index` || id === `${base}/${last}`;
  });
  return hit?.path;
};

function buildTrail(pathname, docs) {
  if (pathname === '/') return null; // landing page: no trail
  if (pathname === '/docs/intro') return [{label: 'Contents'}];

  const doc = docs.find((d) => clean(d.path) === pathname);
  if (!doc) {
    // the generated chapter overview pages
    const chapter = chapters.find((c) => clean(c.link) === pathname);
    return chapter ? [{label: chapter.title}] : null;
  }

  // doc id = folders + file name; the file name is dropped when it only stands for its folder
  const segs = doc.id.split('/');
  const file = segs[segs.length - 1];
  const folders = segs.slice(0, -1);
  const parent = folders[folders.length - 1];
  const isIndex = parent && ['readme', 'index', parent.toLowerCase()].includes(file.toLowerCase());
  const soleDoc = parent && docs.filter((d) => d.id.startsWith(`${folders.join('/')}/`)).length === 1;
  const names = isIndex || soleDoc ? folders : [...folders, file];

  return names.map((name, i) => {
    let label = name;
    let to;
    if (i === 0) {
      const chapter = chapters.find((c) => c.key === name);
      if (chapter) {
        label = chapter.title;
        to = chapter.link;
      }
    }
    if (!to) to = pageFor(names.slice(0, i + 1).join('/'), docs);
    return {label, to};
  });
}

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M3 9.5 10 3l7 6.5V17h-4.5v-5h-5v5H3z" fill="currentColor" />
  </svg>
);

const Chevron = () => (
  <svg className={styles.sep} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BookBreadcrumbs({mobile}) {
  const pathname = clean(useLocation().pathname);
  const docs = useAllDocsData().default?.versions?.[0]?.docs ?? [];
  const trail = buildTrail(pathname, docs);
  if (!trail) return null;

  return (
    <nav className={clsx(styles.crumbs, mobile && styles.mobile)} aria-label="Breadcrumb">
      <Link to="/docs/intro/" className={styles.home} aria-label="Contents" title="Contents"><HomeIcon /></Link>
      {trail.map((c, i) => {
        const last = i === trail.length - 1;
        return (
          <React.Fragment key={`${i}-${c.label}`}>
            <Chevron />
            {c.to && !last ? (
              <Link to={c.to} className={styles.crumb} title={c.label}>{c.label}</Link>
            ) : (
              <span
                className={clsx(styles.crumb, last && styles.current)}
                title={c.label}
                aria-current={last ? 'page' : undefined}>
                {c.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}