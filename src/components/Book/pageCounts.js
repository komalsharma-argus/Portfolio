import {useSyncExternalStore} from 'react';
import chapters from '@site/src/data/chapters.json';

const STORAGE_KEY = 'book-page-counts-v2';
const VERSION = 1; // bump this after changing fonts, margins or other page styling

export const layoutKey = () => `${VERSION}:${window.innerWidth}x${window.innerHeight}`;

const listeners = new Set();
let state = null; // {layout, items: {[chapterKey]: {hash, pages, per}}}

function init() {
  if (state) return;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && saved.layout === layoutKey() && saved.items) {
      state = saved;
      return;
    }
  } catch {
    // unreadable: start again
  }
  state = {layout: layoutKey(), items: {}};
}

function commit(next) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
  listeners.forEach((l) => l());
}

const valid = (item, chapter) => !!item && item.hash === chapter.hash;

export const currentLayout = () => {
  init();
  return state.layout;
};

export function resetLayout() {
  init();
  commit({layout: layoutKey(), items: {}});
}

export function report(key, pages, per) {
  init();
  const chapter = chapters.find((c) => c.key === key);
  if (!chapter) return;
  const base = state.layout === layoutKey() ? state : {layout: layoutKey(), items: {}};
  const prev = base.items[key];
  if (base === state && valid(prev, chapter) && prev.pages === pages && prev.per === per) return;
  commit({...base, items: {...base.items, [key]: {hash: chapter.hash, pages, per}}});
}

export function nextMissing(tried) {
  init();
  return chapters.find((c) => !valid(state.items[c.key], c) && !tried.has(c.key))?.key;
}

// first page number of every chapter; null once an earlier chapter is still unknown
function computeStarts(items) {
  const starts = {};
  let next = 1;
  chapters.forEach((c) => {
    starts[c.key] = next;
    const item = items[c.key];
    if (next === null || !valid(item, c)) {
      next = null;
      return;
    }
    // two-page layout: a chapter always fills whole spreads, so left pages stay odd
    next += item.per === 2 ? item.pages + (item.pages % 2) : item.pages;
  });
  return starts;
}

const EMPTY = {items: {}, starts: {}};
let cache = {source: null, value: EMPTY};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  init();
  if (cache.source !== state) {
    cache = {source: state, value: {items: state.items, starts: computeStarts(state.items)}};
  }
  return cache.value;
};

export function usePageCounts() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}