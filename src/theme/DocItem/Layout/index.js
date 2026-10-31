import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemContent from '@theme/DocItem/Content';
import BookFrame from '@site/src/components/Book/BookFrame';
import TableOfContents from '@site/src/components/Book/TableOfContents';
import chapters from '@site/src/data/chapters.json';
import styles from '@site/src/components/Book/BookFrame.module.css';

export default function DocItemLayout({children}) {
  const {metadata, toc} = useDoc();
  const isIntro = metadata.id === 'intro';
  const chapter = chapters.find((c) => c.key === metadata.id.split('/')[0]);
  const runningHead = isIntro
    ? 'Contents'
    : chapter
      ? `Chapter ${chapter.number} · ${chapter.title}`
      : metadata.title;

  const bookmark =
  !isIntro && chapter ? {chapterKey: chapter.key, path: metadata.permalink} : null;
  return (
    <BookFrame
      key={metadata.id}
      runningHead={runningHead}
      toc={toc}
      searchChapter={chapter?.key}
      bookmark={bookmark}
      showBack={!isIntro}
      chapterKey={chapter?.key}
      prev={metadata.previous}
      next={metadata.next}>
      {isIntro && (
        <div className={styles.columnBreak}>
          <TableOfContents />
        </div>
      )}
      <DocItemContent>{children}</DocItemContent>
    </BookFrame>
  );
}