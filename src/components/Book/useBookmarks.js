import {useCallback, useEffect, useState} from 'react';

const KEY = 'book-bookmarks-v1';
const EVENT = 'book-bookmarks-changed';

const read = () => {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const write = (data) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode, full): ignore
  }
  window.dispatchEvent(new Event(EVENT));
};

// bookmarks = { [chapterKey]: { path, block, savedAt } }
export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    const sync = () => setBookmarks(read());
    sync();
    window.addEventListener(EVENT, sync); // same tab
    window.addEventListener('storage', sync); // other tabs
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setBookmark = useCallback((chapterKey, data) => write({...read(), [chapterKey]: data}), []);
  const clearBookmark = useCallback((chapterKey) => {
    const all = read();
    delete all[chapterKey];
    write(all);
  }, []);

  return {bookmarks, setBookmark, clearBookmark};
}