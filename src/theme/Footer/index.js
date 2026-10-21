import React from 'react';
import styles from './styles.module.css';

const NAME = 'Komal Sharma';
const LINKS = [
  ['LinkedIn', 'https://www.linkedin.com/in/komalsharma2023'],
  ['Instagram', 'https://www.instagram.com/_.komal_sharma.__'],
  ['GitHub', 'https://github.com/komalsharma-argus'],
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>Copyright © {new Date().getFullYear()} Made with ❤️ By {NAME}. Built with React && Docusaurus.</span>
      <nav className={styles.links}>
        {LINKS.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
        ))}
      </nav>
    </footer>
  );
}