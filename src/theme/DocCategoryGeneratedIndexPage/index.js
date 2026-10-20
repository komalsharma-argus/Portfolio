import React from 'react';
import Link from '@docusaurus/Link';
import {PageMetadata} from '@docusaurus/theme-common';
import {useCurrentSidebarCategory} from '@docusaurus/plugin-content-docs/client';
import BookFrame from '@site/src/components/Book/BookFrame';
import chapters from '@site/src/data/chapters.json';
import styles from '@site/src/components/Book/ChapterIndex.module.css';

const flatten = (items) =>
  items.map((item) =>
    item.type === 'category' && !item.href && item.items.length === 1 && item.items[0].type === 'link'
      ? {...item.items[0], name: item.label}
      : item,
  );

  const nameOf = (item) => {
  if (item.name) return item.name;
  if (item.type !== 'link' || !item.docId) return item.label;
  const parts = item.docId.split('/');
  const file = parts[parts.length - 1];
  const parent = parts[parts.length - 2];
  const isIndex = ['readme', 'index', (parent || '').toLowerCase()].includes(file.toLowerCase());
  return isIndex && parent ? parent : file;
};

function Entries({items}) {
  return (
    <ul className={styles.list}>
      {flatten(items).map((item, i) => {
        const hasChildren = item.type === 'category' && item.items?.length > 0;
        if (!hasChildren) {
          return item.href ? (
            <li key={i}>
              <Link to={item.href} className={styles.entry}>
                <span>{nameOf(item)}</span>
                <span className={styles.dots} aria-hidden="true" />
              </Link>
            </li>
          ) : null;
        }
        return (
          <li key={i} className={styles.group}>
            {item.href ? (
              <Link to={item.href} className={styles.groupTitle}>{item.label}</Link>
            ) : (
              <span className={styles.groupTitle}>{item.label}</span>
            )}
            <Entries items={item.items} />
          </li>
        );
      })}
    </ul>
  );
}

export default function DocCategoryGeneratedIndexPage({categoryGeneratedIndex}) {
  const category = useCurrentSidebarCategory();
  const nav = categoryGeneratedIndex.navigation;
  const chapter = chapters.find((c) => c.link === categoryGeneratedIndex.permalink.replace(/\/$/, ''));
  const title = chapter?.title ?? categoryGeneratedIndex.title;

  return (
    <>
      <PageMetadata title={categoryGeneratedIndex.title} description={categoryGeneratedIndex.description} />
      <BookFrame
        key={categoryGeneratedIndex.permalink}
        runningHead={chapter ? `Chapter ${chapter.number} · ${title}` : title}
        showBack
        prev={nav.previous}
        next={nav.next}>
        <header className={styles.opener}>
          <h1 className={styles.chapterTitle}>{title}</h1>
          {categoryGeneratedIndex.description && <p>{categoryGeneratedIndex.description}</p>}
        </header>
        <Entries items={category.items} />
      </BookFrame>
    </>
  );
}