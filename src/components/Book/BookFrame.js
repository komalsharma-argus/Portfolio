import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './BookFrame.module.css';

export default function BookFrame({runningHead, toc = [], showBack = true, prev, next, children}) {
  const viewportRef = useRef(null);
  const columnsRef = useRef(null);
  const contentRef = useRef(null);
  const [spread, setSpread] = useState(0);
  const [spreads, setSpreads] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  // distance between two spreads = visible width + column gap
  const getStep = () => {
    const gap = parseFloat(getComputedStyle(columnsRef.current).columnGap) || 0;
    return viewportRef.current.clientWidth + gap;
  };

  const measure = useCallback(() => {
    if (!columnsRef.current || !viewportRef.current) return;
    const n = Math.max(1, Math.ceil(columnsRef.current.scrollWidth / getStep()));
    setSpreads(n);
    setSpread((s) => Math.min(s, n - 1));
  }, []);

  // recount spreads when size, fonts, images or content change
  useEffect(() => {
    measure();
    const t = setTimeout(measure, 400);
    document.fonts?.ready.then(measure);
    const mo = new MutationObserver(measure);
    mo.observe(contentRef.current, {childList: true, subtree: true, attributes: true});
    const el = columnsRef.current;
    el.addEventListener('load', measure, true); // images
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      mo.disconnect();
      el.removeEventListener('load', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === 'ArrowRight') setSpread((s) => Math.min(s + 1, spreads - 1));
      if (e.key === 'ArrowLeft') setSpread((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spreads]);

  // jump to the spread that contains a heading
  const goToHeading = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el || !columnsRef.current?.contains(el)) return;
    const x = el.getBoundingClientRect().left - columnsRef.current.getBoundingClientRect().left;
    setSpread(Math.max(0, Math.floor((x + 2) / getStep())));
    setMenuOpen(false);
  }, []);

  // open directly at a #hash
  useEffect(() => {
    if (!window.location.hash) return;
    const t = setTimeout(() => goToHeading(decodeURIComponent(window.location.hash.slice(1))), 450);
    return () => clearTimeout(t);
  }, [goToHeading]);

  // in-content #links (heading anchors, footnotes)
  const onContentClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    goToHeading(decodeURIComponent(a.getAttribute('href').slice(1)));
  };

  const hasMenu = showBack || toc.length > 0;

  return (
    <div className={styles.desk}>
      <div className={styles.book}>
        <div className={styles.paper}>
          <header className={styles.header}>
            {hasMenu && (
              <button
                type="button"
                className={styles.menuBtn}
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <span className={styles.running}>{runningHead}</span>
          </header>

          {menuOpen && (
            <>
              <div className={styles.scrim} onClick={() => setMenuOpen(false)} />
              <nav className={styles.menu}>
                {showBack && (
                  <Link to="/docs/intro" className={styles.menuLink}>← Table of Contents</Link>
                )}
                {toc.length > 0 && (
                  <>
                    <p className={styles.menuLabel}>On this page</p>
                    <ul className={styles.menuList}>
                      {toc.map((item) => (
                        <li key={item.id} className={item.level === 3 ? styles.indent : undefined}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              goToHeading(item.id);
                            }}
                            dangerouslySetInnerHTML={{__html: item.value}}
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </nav>
            </>
          )}

          <div className={styles.viewport} ref={viewportRef}>
            <div className={styles.columns} ref={columnsRef} style={{'--spread': spread}} onClick={onContentClick}>
              <div ref={contentRef} className={styles.content}>{children}</div>
            </div>
          </div>

          <footer className={styles.footer}>
            {spread > 0 ? (
              <button type="button" className={styles.navBtn} onClick={() => setSpread((s) => s - 1)}>‹ Previous</button>
            ) : prev ? (
              <Link to={prev.permalink} className={styles.navBtn}>‹ {prev.title}</Link>
            ) : (
              <span />
            )}
            <span className={styles.counter}>{spread + 1} / {spreads}</span>
            {spread < spreads - 1 ? (
              <button type="button" className={styles.navBtn} onClick={() => setSpread((s) => s + 1)}>Next ›</button>
            ) : next ? (
              <Link to={next.permalink} className={styles.navBtn}>{next.title} ›</Link>
            ) : (
              <span />
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}