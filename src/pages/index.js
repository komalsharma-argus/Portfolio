import React, {useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import useBookmarks from '../components/Book/useBookmarks';

const AUTHOR = {
  name: 'Komal Sharma',
  role: 'Programmer Analyst',
  bio: 'Notes of all the topics learnt during my probation period.',
};

const STACK = [
  ['Docusaurus', 'turns my Markdown files into pages and routes'],
  ['React', 'powers the book layout and table of contents'],
  ['Tailwind CSS + DaisyUI', 'styling, themes and dark/light mode'],
  ['GitHub', 'every chapter is a .md file in my repositories'],
];

export default function Home() {
  const {bookmarks} = useBookmarks();
  const latest = Object.values(bookmarks).sort((a, b) => b.savedAt - a.savedAt)[0];
  return (
    <Layout title="Home" description="A book of developer notes on important topics">
      <main className={styles.book}>
        <section className={styles.page}>
          <p className={styles.kicker}>A living book of</p>
          <h1>Programmer Analyst Intern Notes</h1>
          <p className={styles.by}>by {AUTHOR.name}</p>
          <h2>About the author</h2>
          <p><strong>{AUTHOR.name}</strong>, {AUTHOR.role}</p>
          <p>{AUTHOR.bio}</p>
        </section>
        <section className={styles.page}>
          <h2>How it's built</h2>
          <ul>
            {STACK.map(([name, what]) => (
              <li key={name}><strong>{name}</strong>: {what}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link to="/docs/intro" className={clsx('btn btn-lg', styles.cta)}>Start Reading</Link>
            {latest && (
              <Link to={`${latest.path}?bm=${latest.block}`} className={clsx('btn btn-lg', styles.resumeBtn)}>
                Continue reading
              </Link>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}