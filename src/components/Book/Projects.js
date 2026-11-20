import React from 'react';
import projects from '@site/src/data/projects';
import styles from './Projects.module.css';

const OpenIcon = () => (
  <svg className={styles.arrow} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M5 2h7v7M12 2 3 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Projects() {
  if (!projects.length) return null;
  return (
    <section className={styles.projects} aria-label="Projects">
      <h2 className={styles.heading}>Projects</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.url}>
            <a
              className={styles.card}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} (opens in a new tab)`}>
              <span className={styles.top}>
                <span className={styles.title}>{p.title}</span>
                <OpenIcon />
              </span>
              <span className={styles.desc}>{p.description}</span>
              {p.tags?.length > 0 && (
                <ul className={styles.tags}>
                  {p.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}