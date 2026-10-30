import React, {useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import {useHistory} from '@docusaurus/router';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import chapters from '@site/src/data/chapters.json';
import {useSearchIndex, runSearch} from './searchIndex';
import styles from './BookSearch.module.css';

const termsOf = (q) => q.trim().split(/\s+/).filter((t) => t.length >= 2);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// a short piece of text around the first match
function snippet(text, terms) {
  const lower = text.toLowerCase();
  let at = -1;
  terms.forEach((t) => {
    const i = lower.indexOf(t.toLowerCase());
    if (i !== -1 && (at === -1 || i < at)) at = i;
  });
  const start = Math.max(0, (at === -1 ? 0 : at) - 50);
  const piece = text.slice(start, start + 140);
  return `${start > 0 ? '…' : ''}${piece}${start + 140 < text.length ? '…' : ''}`;
}

function Marked({text, terms}) {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'ig');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

// group the hits by chapter, in order of best match, and number them for the keyboard
function group(results) {
  const groups = [];
  const byTitle = new Map();
  results.forEach((r) => {
    if (!byTitle.has(r.chapterTitle)) {
      const g = {title: r.chapterTitle, items: []};
      byTitle.set(r.chapterTitle, g);
      groups.push(g);
    }
    byTitle.get(r.chapterTitle).items.push(r);
  });
  let n = 0;
  groups.forEach((g) => g.items.forEach((r) => { r.idx = n++; }));
  return {groups, flat: groups.flatMap((g) => g.items)};
}

const SearchIcon = () => (
  <svg className={styles.icon} width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// variant "navbar": the whole book. variant "page": one chapter (can be widened to the whole book)
export default function BookSearch({variant = 'navbar', chapter}) {
  const history = useHistory();
  const docs = useAllDocsData().default?.versions?.[0]?.docs ?? [];
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(false);
  const index = useSearchIndex(wanted);

  const scope = variant === 'page' && !wide ? chapter : undefined;
  const scopeTitle = chapters.find((c) => c.key === chapter)?.title;
  const terms = termsOf(query);
  const long = query.trim().length >= 2;

  const {groups, flat} = useMemo(() => {
    if (index.status !== 'ready' || !long) return {groups: [], flat: []};
    return group(runSearch(index, query, scope));
  }, [index, query, scope, long]);

  useEffect(() => setActive(0), [query, scope]);

  useEffect(() => {
    if (open) {
      setWanted(true);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block: 'nearest'});
  }, [active, flat]);

  // "/" or Ctrl/Cmd+K opens the navbar search
  useEffect(() => {
    if (variant !== 'navbar') return undefined;
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant]);

  const pathOf = (id) =>
    (docs.find((d) => d.id === id) || docs.find((d) => d.id.toLowerCase() === id.toLowerCase()))?.path;

  const go = (r) => {
    const to = pathOf(r.id);
    if (!to) return;
    const hl = terms.length ? `?hl=${encodeURIComponent(terms.join(' '))}` : '';
    const hash = r.anchor ? `#${encodeURIComponent(r.anchor)}` : '';
    history.push(`${to}${hl}${hash}`);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && flat[active]) {
      e.preventDefault();
      go(flat[active]);
    } else if (e.key === 'Escape') {
      if (query) setQuery('');
      else {
        setOpen(false);
        e.target.blur();
      }
    }
  };

  const placeholder = variant === 'page' && scope && scopeTitle ? `Search in ${scopeTitle}` : 'Search the book';
  const showResults = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={clsx(styles.root, styles[variant], open && styles.open)}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={variant === 'page' ? 'Search this chapter' : 'Search'}
        title={variant === 'page' ? 'Search this chapter' : 'Search'}
        onClick={() => setOpen((o) => !o)}>
        <SearchIcon />
      </button>

      <div className={styles.sheet}>
        <label className={styles.field}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={query}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setOpen(true);
              setWanted(true);
            }}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className={styles.close}
            aria-label="Close search"
            onClick={() => {
              setOpen(false);
              setQuery('');
            }}>
            ×
          </button>
        </label>

        {variant === 'page' && chapter && scopeTitle && (
          <p className={styles.scope}>
            {wide ? 'All chapters' : <>In <strong>{scopeTitle}</strong></>}
            {' · '}
            <button type="button" className={styles.widen} onClick={() => setWide((w) => !w)}>
              {wide ? `Only ${scopeTitle}` : 'Search all chapters'}
            </button>
          </p>
        )}

        {showResults && (
          <div className={styles.results} ref={listRef} role="listbox">
            {index.status === 'loading' && <p className={styles.status}>Loading the search index…</p>}
            {index.status === 'error' && (
              <p className={styles.status}>
                The search index could not be loaded. Restart <code>npm start</code> (it builds the index) and reload.
              </p>
            )}
            {index.status === 'ready' && !long && <p className={styles.status}>Type at least two letters.</p>}
            {index.status === 'ready' && long && flat.length === 0 && (
              <p className={styles.status}>No results for “{query.trim()}”.</p>
            )}
            {groups.map((g) => (
              <div key={g.title}>
                <div className={styles.group}>{g.title}</div>
                {g.items.map((r) => (
                  <button
                    key={r.idx}
                    type="button"
                    role="option"
                    aria-selected={r.idx === active}
                    className={styles.item}
                    onMouseEnter={() => setActive(r.idx)}
                    onClick={() => go(r)}>
                    <span className={styles.where}><Marked text={r.topic} terms={terms} /></span>
                    {r.heading && r.heading !== r.topic && (
                      <span className={styles.heading}> › <Marked text={r.heading} terms={terms} /></span>
                    )}
                    <span className={styles.snippet}><Marked text={snippet(r.text, terms)} terms={terms} /></span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}