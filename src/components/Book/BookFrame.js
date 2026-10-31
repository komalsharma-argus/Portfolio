import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './BookFrame.module.css';
import clsx from 'clsx';
import useBookmarks from './useBookmarks';
import {useLocation} from '@docusaurus/router';
import BookSearch from './BookSearch';
import {highlightTerms, clearHighlights} from './highlight';
import {usePageCounts, report as reportPages} from './pageCounts';

const FLIP_MS = 900;
const SLIM_FROM = 120;

export default function BookFrame({runningHead, toc = [], showBack = true, prev, next, bookmark = null, searchChapter, chapterKey, children}) {
  const paperRef = useRef(null);
  const viewportRef = useRef(null);
  const columnsRef = useRef(null);
  const contentRef = useRef(null);
  const fxRef = useRef(null);
  const busy = useRef(false);
  const holdNumbers = useRef(false);
  const [pages, setPages] = useState(1);
  const [perSpread, setPerSpread] = useState(2);
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(0);
  const [spread, setSpread] = useState(0);
  const [spreads, setSpreads] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedPage, setSavedPage] = useState(-1);

  const location = useLocation();

  const {bookmarks, setBookmark, clearBookmark} = useBookmarks();
  const counts = usePageCounts();
  const hasCount = !!(chapterKey && counts.items[chapterKey]); 
  const mine = bookmark ? bookmarks[bookmark.chapterKey] : undefined;

  const getGap = () => {
    const cs = getComputedStyle(columnsRef.current);
    const gap = parseFloat(cs.columnGap);
    return Number.isNaN(gap) ? parseFloat(cs.fontSize) || 0 : gap; 
  };

 const getStep = () => {
  const cs = getComputedStyle(columnsRef.current);
  let gap = parseFloat(cs.columnGap);
  if (Number.isNaN(gap)) gap = parseFloat(cs.fontSize) || 0; // "normal" = 1em
  return viewportRef.current.getBoundingClientRect().width + gap;
};

  const measure = useCallback(() => {
    const cols = columnsRef.current;
    const vp = viewportRef.current;
    if (!cols || !vp) return;
    const per = parseInt(getComputedStyle(cols).columnCount, 10) || 1;
    const gap = getGap();
    const width = vp.getBoundingClientRect().width;
    const colW = (width - gap * (per - 1)) / per;
    const total = Math.max(1, Math.round((cols.scrollWidth + gap) / (colW + gap)));
    const n = Math.max(1, Math.ceil(total / per));
    setStep(width + gap);
    setPerSpread(per);
    setPages(total);
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

  useEffect(() => {
    if (!holdNumbers.current) setShown(spread);
  }, [spread]);

  const blocksRoot = () => contentRef.current.querySelector('.markdown') || contentRef.current;

  const spreadOf = useCallback((el) => {
    const x = el.getBoundingClientRect().left - columnsRef.current.getBoundingClientRect().left;
    return Math.max(0, Math.floor((x + 2) / getStep()));
  }, []);

  const getColStep = () => {
    const per = parseInt(getComputedStyle(columnsRef.current).columnCount, 10) || 1;
    const gap = getGap();
    const width = viewportRef.current.getBoundingClientRect().width;
    return (width - gap * (per - 1)) / per + gap;
  };

  const pageOf = useCallback((el) => {
    const x = el.getBoundingClientRect().left - columnsRef.current.getBoundingClientRect().left;
    return Math.max(0, Math.floor((x + 2) / getColStep()));
  }, []);

  const firstBlockOfPage = (p) => {
    const blocks = [...blocksRoot().children];
    const left = columnsRef.current.getBoundingClientRect().left;
    const start = p * getColStep() - 2;
    const i = blocks.findIndex((el) => el.getBoundingClientRect().left - left >= start);
    return i === -1 ? Math.max(0, blocks.length - 1) : i;
  };

  // jump to the spread that contains a heading
  const goToHeading = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el || !columnsRef.current?.contains(el)) return;
    setSpread(spreadOf(el));
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
      setSavedPage(-1);
      return;
    }
    const el = blocksRoot().children[mine.block];
    setSavedPage(el ? pageOf(el) : -1);
  }, [bookmark?.path, mine, spread, spreads, pages, perSpread, pageOf]);

  useEffect(() => {
    if (!chapterKey) return undefined;
    const inFrame = new URLSearchParams(window.location.search).has('measure');
    const t = setTimeout(
      () => {
        if (inFrame) {
          window.parent.postMessage({type: 'book-pages', key: chapterKey, pages, per: perSpread}, window.location.origin);
        } else {
          reportPages(chapterKey, pages, perSpread);
        }
      },
      inFrame ? 900 : 600,
    );
    return () => clearTimeout(t);
  }, [chapterKey, pages, perSpread, hasCount]);

  const onThisSpread = savedPage >= 0 && Math.floor(savedPage / perSpread) === spread;

  const toggleBookmark = (side) => {
    if (!bookmark) return;
    const page = spread * perSpread + side;
    if (savedPage === page) {
      clearBookmark(bookmark.chapterKey);
    } else {
      setBookmark(bookmark.chapterKey, {path: bookmark.path, block: firstBlockOfPage(page), savedAt: Date.now()});
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

    useEffect(() => {
      const terms = (new URLSearchParams(location.search).get('hl') || '').split(/\s+/).filter(Boolean);
      const hash = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
      if (!terms.length && !hash) return undefined;
      const t = setTimeout(() => {
        const marks = highlightTerms(contentRef.current, terms, styles.hit);
        const heading = hash ? document.getElementById(hash) : null;
        // the first match inside the chosen section, otherwise the first match on the page
        const target = marks.length
          ? (heading && marks.find((m) => heading.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING)) || marks[0]
          : null;
        if (target) {
          setSpread(spreadOf(target));
          setMenuOpen(false);
        } else if (hash) {
          goToHeading(hash);
        }
      }, 450);
      return () => clearTimeout(t);
    }, [location.key, location.search, location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

    // Esc clears the highlights
    useEffect(() => {
      const onKey = (e) => e.key === 'Escape' && clearHighlights(contentRef.current, styles.hit);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

  const flip = (dir) => {
    const target = spread + dir;
    if (busy.current || target < 0 || target >= spreads) return;

    const cols = columnsRef.current;
    // const twoPages = getComputedStyle(cols).columnCount === '2';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (perSpread !== 2 || reduced) {
      setSpread(target); // one-page layout or reduced motion: plain slide
      return;
    }

    busy.current = true;
    holdNumbers.current = true;
    const fx = fxRef.current;
    const pr = paperRef.current.getBoundingClientRect();
    const vr = viewportRef.current.getBoundingClientRect();
    const half = pr.width / 2;
    const vx = vr.left - pr.left; // reading area offset inside the paper
    const stepPx = getStep();

    const make = (className, css) => {
      const node = document.createElement('div');
      node.className = className;
      Object.assign(node.style, css);
      return node;
    };
    // a copy of the reading area showing one spread. Long texts: only the blocks on that spread
    const copyOfSpread = (index) => {
      const root = blocksRoot();
      const blocks = [...root.children];
      const finish = (shell) => {
        shell.removeAttribute('style');
        shell.style.transition = 'none';
        shell.style.transform = `translateX(${-index * stepPx}px)`;
        shell.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
        return shell;
      };
      if (blocks.length < SLIM_FROM) return finish(cols.cloneNode(true));

      const colsRect = cols.getBoundingClientRect();
      const colStep = getColStep();
      const from = index * stepPx - 2;
      const to = (index + 1) * stepPx - 2;

      const spans = blocks.map((el) => {
        const rects = el.getClientRects();
        if (!rects.length) return {el, x: -Infinity, y: 0, right: -Infinity};
        const a = rects[0]; // where the block starts
        const b = rects[rects.length - 1]; // where it ends
        return {el, x: a.left - colsRect.left, y: a.top - colsRect.top, right: b.right - colsRect.left};
      });
      const inside = spans.filter((s) => s.right > from && s.x < to);
      if (!inside.length) return finish(cols.cloneNode(false));

      // a spacer stands in for everything before the first copied block
      const first = inside[0];
      const col = Math.floor((first.x + 2) / colStep);
      const marginTop = parseFloat(getComputedStyle(first.el).marginTop) || 0;
      const spacer = document.createElement('div');
      spacer.style.height = `${Math.max(0, col * colsRect.height + first.y - marginTop)}px`;

      const shell = cols.cloneNode(false);
      let parent = shell;
      const chain = [];
      for (let el = root; el && el !== cols; el = el.parentElement) chain.unshift(el);
      chain.forEach((el) => {
        const copy = el.cloneNode(false);
        parent.appendChild(copy);
        parent = copy;
      });
      parent.appendChild(spacer);
      inside.forEach((s) => parent.appendChild(s.el.cloneNode(true)));
      return finish(shell);
    };

    const replica = (index, left) => {
      const box = make(styles.replica, {
        left: `${left}px`,
        top: `${vr.top - pr.top}px`,
        width: `${vr.width}px`,
        height: `${vr.height}px`,
      });
      box.appendChild(copyOfSpread(index));
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

    const mid = setTimeout(() => {
      holdNumbers.current = false;
      setShown(target);
    }, FLIP_MS/2);

    let timer;
    const done = () => {
      clearTimeout(timer);
      clearTimeout(mid);
      holdNumbers.current = false;
      setShown(target);
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
  }, [spread, spreads, perSpread]); // eslint-disable-line react-hooks/exhaustive-deps

  // in-content #links (heading anchors, footnotes)
  const onContentClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    goToHeading(decodeURIComponent(a.getAttribute('href').slice(1)));
  };

  const hasMenu = showBack || toc.length > 0;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const start = chapterKey ? counts.starts[chapterKey] : null;
  const leftNo = start ? start + shown * perSpread : null;
  const rightNo = leftNo === null ? null : leftNo + 1;
  const showRight = perSpread === 2 && leftNo !== null && shown * perSpread + 2 <= pages;

  const prevArrow =
    spread > 0 ? (
    <button type="button" className={styles.arrow} aria-label="Previous page" title="Previous page" onClick={() => flip(-1)}> ‹ </button>
    ) : prev ? (
    <Link to={prev.permalink} className={styles.arrow} aria-label={`Previous topic: ${prev.title}`} title={`Previous: ${prev.title}`}>‹ {prev.title}</Link>
    ) : null;
    const nextArrow =
    spread < spreads - 1 ? (
    <button type="button" className={styles.arrow} aria-label="Next page" title="Next page" onClick={() => flip(1)}> › </button>
    ) : next ? (
    <Link to={next.permalink} className={styles.arrow} aria-label={`Next topic: ${next.title}`} title={`Next: ${next.title}`}>{next.title} ›</Link>
    ) : null;

  return (
    <div className={styles.desk} data-book-root>
      <div className={styles.book}>
        <div className={styles.paper} ref={paperRef}>
          <header className={styles.header}>
            <span className={styles.running}>{runningHead}</span>
            <span className={clsx(styles.running, styles.runningRight)} aria-hidden="true">{runningHead}</span>
            {hasMenu && (
              <button
                type="button"
                className={styles.menuBtn}
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <circle cx="10" cy="4" r="1.8" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.8" fill="currentColor" />
                  <circle cx="10" cy="16" r="1.8" fill="currentColor" />
                </svg>
              </button>
            )}
            <BookSearch variant="page" chapter={searchChapter} />
          </header>
          <div className={styles.rule} aria-hidden="true" />
          {bookmark && (perSpread === 2 ? [0, 1] : [0]).map((side, i, all) => {
            const on = savedPage === spread * perSpread + side;
            const last = i === all.length - 1; // the ribbon next to the menu button
            return (
              <button
                key={side}
                type="button"
                className={clsx(styles.ribbon, last ? styles.ribbonRight : styles.ribbonLeft, on && styles.ribbonOn)}
                onClick={() => toggleBookmark(side)}
                aria-pressed={on}
                aria-label={on ? 'Remove bookmark' : 'Bookmark this page'}
                title={on ? 'Remove bookmark' : mine ? 'Move bookmark here' : 'Bookmark this page'}
              />
            );
          })}

          <div className={clsx(styles.scrim, menuOpen && styles.scrimOpen)} onClick={() => setMenuOpen(false)} />
          <aside
            className={clsx(styles.sidebar, menuOpen && styles.sidebarOpen)}
            aria-hidden={!menuOpen}
            aria-label="Page contents">
            <div className={styles.sideHead}>
              <span className={styles.sideTitle}>{runningHead}</span>
              <button type="button" className={styles.sideClose} aria-label="Close" onClick={() => setMenuOpen(false)}>
                &times;
              </button>
            </div>

            {showBack && (
              <Link to="/docs/intro" className={styles.menuLink}>← Table of Contents</Link>
            )}

            {bookmark && mine && !onThisSpread &&
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
          </aside>
          <div className={styles.viewport} ref={viewportRef}>
            <div 
              className={styles.columns} 
              ref={columnsRef} 
              style={{'--spread': spread, transform: `translateX(${-spread * step}px)`}} 
              onClick={onContentClick}
            >
              <div ref={contentRef} className={styles.content}>{children}</div>
            </div>
          </div>

          <div className={styles.rule} aria-hidden="true" />

          <div className={styles.fx} ref={fxRef} aria-hidden="true" />

          <footer className={styles.footer}>
            <div className={styles.footCell}>
              <span className={styles.pageNo}>
                {leftNo !== null && <span className={styles.pageNo}>{leftNo}</span>}
              </span>
              {prevArrow}
            </div>
            <div className={clsx(styles.footCell, styles.footRight)}>
              {nextArrow}
              {showRight && <span className={styles.pageNo}>{rightNo}</span>}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}