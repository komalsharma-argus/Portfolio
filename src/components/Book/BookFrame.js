import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './BookFrame.module.css';
import clsx from 'clsx';
import useBookmarks from './useBookmarks';

const FLIP_MS = 900;

export default function BookFrame({runningHead, toc = [], showBack = true, prev, next, bookmark = null, children}) {
  const paperRef = useRef(null);
  const viewportRef = useRef(null);
  const columnsRef = useRef(null);
  const contentRef = useRef(null);
  const fxRef = useRef(null);
  const busy = useRef(false);
  const [spread, setSpread] = useState(0);
  const [spreads, setSpreads] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookmarkedHere, setBookmarkedHere] = useState(false);

  const {bookmarks, setBookmark, clearBookmark} = useBookmarks();
  const mine = bookmark ? bookmarks[bookmark.chapterKey] : undefined;

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

  const blocksRoot = () => contentRef.current.querySelector('.markdown') || contentRef.current;

  const spreadOf = useCallback((el) => {
    const x = el.getBoundingClientRect().left - columnsRef.current.getBoundingClientRect().left;
    return Math.max(0, Math.floor((x + 2) / getStep()));
  }, []);

  const firstBlockOfSpread = () => {
    const blocks = [...blocksRoot().children];
    const left = columnsRef.current.getBoundingClientRect().left;
    const start = spread * getStep() - 2;
    const i = blocks.findIndex((el) => el.getBoundingClientRect().left - left >= start);
    return i === -1 ? Math.max(0, blocks.length - 1) : i;
  };

  // jump to the spread that contains a heading
  const goToHeading = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el || !columnsRef.current?.contains(el)) return;
    const x = el.getBoundingClientRect().left - columnsRef.current.getBoundingClientRect().left;
    setSpread(Math.max(0, Math.floor((x + 2) / getStep())));
    setMenuOpen(false);
  }, [spreadOf]);

  const goToBlock = useCallback((index) => {
    const el = blocksRoot().children[index];
    if (!el) return;
    setSpread(spreadOf(el));
    setMenuOpen(false);
  }, [spreadOf]);

  useEffect(() => {
    if (!bookmark || !mine || mine.path !== bookmark.path) {
      setBookmarkedHere(false);
      return;
    }
    const el = blocksRoot().children[mine.block];
    setBookmarkedHere(el ? spreadOf(el) === spread : false);
  }, [bookmark?.path, mine, spread, spreads, spreadOf]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleBookmark = () => {
    if (!bookmark) return;
    if (bookmarkedHere) {
      clearBookmark(bookmark.chapterKey);
    } else {
      setBookmark(bookmark.chapterKey, {path: bookmark.path, block: firstBlockOfSpread(), savedAt: Date.now()});
    }
  };

  // opened from a bookmark link (?bm=<block>): jump to that block
  useEffect(() => {
    const bm = new URLSearchParams(window.location.search).get('bm');
    if (bm === null) return;
    const run = () => goToBlock(parseInt(bm, 10));
    const t1 = setTimeout(run, 450);
    const t2 = setTimeout(run, 1300); // again, once fonts and images have settled
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [goToBlock]);

  // open directly at a #hash
  useEffect(() => {
    if (!window.location.hash) return;
    const t = setTimeout(() => goToHeading(decodeURIComponent(window.location.hash.slice(1))), 450);
    return () => clearTimeout(t);
  }, [goToHeading]);

  const flip = (dir) => {
    const target = spread + dir;
    if (busy.current || target < 0 || target >= spreads) return;

    const cols = columnsRef.current;
    const twoPages = getComputedStyle(cols).columnCount === '2';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!twoPages || reduced) {
      setSpread(target); // one-page layout or reduced motion: plain slide
      return;
    }

    busy.current = true;
    const fx = fxRef.current;
    const pr = paperRef.current.getBoundingClientRect();
    const vr = viewportRef.current.getBoundingClientRect();
    const half = pr.width / 2;
    const vx = vr.left - pr.left; // reading area offset inside the paper

    const make = (className, css) => {
      const node = document.createElement('div');
      node.className = className;
      Object.assign(node.style, css);
      return node;
    };
    // a copy of the whole reading area, showing a given spread, placed inside a page
    const replica = (index, left) => {
      const box = make(styles.replica, {
        left: `${left}px`,
        top: `${vr.top - pr.top}px`,
        width: `${vr.width}px`,
        height: `${vr.height}px`,
      });
      const copy = cols.cloneNode(true);
      copy.removeAttribute('style');
      copy.style.setProperty('--spread', index);
      copy.style.transition = 'none';
      copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
      box.appendChild(copy);
      return box;
    };
    const face = (className, content) => {
      const f = make(`${styles.face} ${className}`, {});
      f.appendChild(content);
      return f;
    };

    let still;
    let flipper;
    if (dir > 0) {
      // the right page turns over to the left
      still = make(`${styles.still} ${styles.pageLeft}`, {left: '0', width: `${half}px`});
      still.appendChild(replica(spread, vx));
      flipper = make(styles.flipper, {left: `${half}px`, width: `${half}px`, transformOrigin: 'left center'});
      flipper.appendChild(face(styles.pageRight, replica(spread, vx - half)));
      flipper.appendChild(face(`${styles.pageLeft} ${styles.back}`, replica(target, vx)));
    } else {
      // the left page turns back over to the right
      still = make(`${styles.still} ${styles.pageRight}`, {left: `${half}px`, width: `${half}px`});
      still.appendChild(replica(spread, vx - half));
      flipper = make(styles.flipper, {left: '0', width: `${half}px`, transformOrigin: 'right center'});
      flipper.appendChild(face(styles.pageLeft, replica(spread, vx)));
      flipper.appendChild(face(`${styles.pageRight} ${styles.back}`, replica(target, vx - half)));
    }

    fx.append(still, flipper);
    cols.style.transition = 'none';
    setSpread(target); // the real content jumps underneath the turning sheet

    flipper.getBoundingClientRect(); // commit the starting position
    flipper.style.transition = `transform ${FLIP_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`;
    requestAnimationFrame(() => {
      flipper.style.transform = `rotateY(${dir > 0 ? -180 : 180}deg)`;
    });

    let timer;
    const done = () => {
      clearTimeout(timer);
      flipper.removeEventListener('transitionend', onEnd);
      fx.replaceChildren();
      cols.style.transition = '';
      busy.current = false;
    };
    const onEnd = (e) => {
      if (e.target === flipper && e.propertyName === 'transform') done();
    };
    flipper.addEventListener('transitionend', onEnd);
    timer = setTimeout(done, FLIP_MS + 300); // safety net
  };

  // arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === 'ArrowRight') flip(1);
      if (e.key === 'ArrowLeft') flip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spread, spreads]); // eslint-disable-line react-hooks/exhaustive-deps

  // in-content #links (heading anchors, footnotes)
  const onContentClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    goToHeading(decodeURIComponent(a.getAttribute('href').slice(1)));
  };

  const hasMenu = showBack || toc.length > 0;

  return (
    <div className={styles.desk} data-book-root>
      <div className={styles.book}>
        <div className={styles.paper} ref={paperRef}>
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
          {bookmark && (
            <button
              type="button"
              className={clsx(styles.ribbon, bookmarkedHere && styles.ribbonOn)}
              onClick={toggleBookmark}
              aria-pressed={bookmarkedHere}
              aria-label={bookmarkedHere ? 'Remove bookmark' : 'Bookmark this page'}
              title={bookmarkedHere ? 'Remove bookmark' : mine ? 'Move bookmark here' : 'Bookmark this page'}
            />
          )}

          {menuOpen && (
            <>
              <div className={styles.scrim} onClick={() => setMenuOpen(false)} />
              <nav className={styles.menu}>
                {showBack && (
                  <Link to="/docs/intro" className={styles.menuLink}>← Table of Contents</Link>
                )}
                {bookmark && mine && !bookmarkedHere &&
                  (mine.path === bookmark.path ? (
                    <button type="button" className={styles.menuLink} onClick={() => goToBlock(mine.block)}>
                      Go to bookmark
                    </button>
                  ) : (
                    <Link to={`${mine.path}?bm=${mine.block}`} className={styles.menuLink}>
                      Go to bookmark →
                    </Link>
                  ))}
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

          <div className={styles.fx} ref={fxRef} aria-hidden="true" />

          <footer className={styles.footer}>
            {spread > 0 ? (
              <button type="button" className={styles.navBtn} onClick={() => flip(-1)}>‹ Previous</button>
            ) : prev ? (
              <Link to={prev.permalink} className={styles.navBtn}>‹ {prev.title}</Link>
            ) : (
              <span />
            )}
            <span className={styles.counter}>{spread + 1} / {spreads}</span>
            {spread < spreads - 1 ? (
              <button type="button" className={styles.navBtn} onClick={() => flip(1)}>Next ›</button>
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