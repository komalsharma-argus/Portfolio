import React from 'react';
import Link from '@docusaurus/Link';
import chapters from '@site/src/data/chapters.json';
import styles from './TableOfContents.module.css';
import useBookmarks from './useBookmarks';

export default function TableOfContents() {
  const {bookmarks} = useBookmarks();
  return (
    <nav aria-label="Table of Contents">
      <h2 className={styles.heading}>Table of Contents</h2>
      <ol className={styles.list}>
        {chapters.map((c) => {
          const bm = bookmarks[c.key];
          return (
          <li key={c.key} className={styles.item}>
            <Link to={c.link} className={styles.entry}>
              <span className={styles.num}>{String(c.number).padStart(2, '0')}</span>
              <span>{c.title}</span>
              <span className={styles.dots} aria-hidden="true" />
            </Link>
            {bm && (
              <Link to={`${bm.path}?bm=${bm.block}`} className={styles.resume}>Resume ›</Link>
            )}
          </li>
          );
        })}
      </ol>
    </nav>
  );
}