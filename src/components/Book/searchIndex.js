import {useEffect, useState} from 'react';
import MiniSearch from 'minisearch';
import useBaseUrl from '@docusaurus/useBaseUrl';

let cache; // shared by every search box

function load(url) {
  if (!cache) {
    cache = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((entries) => {
        const engine = new MiniSearch({
          idField: 'uid',
          fields: ['heading', 'topic', 'chapterTitle', 'text'],
          storeFields: ['chapter'],
          searchOptions: {prefix: true, fuzzy: 0.2, boost: {topic: 3, heading: 2}, combineWith: 'AND'},
        });
        engine.addAll(entries.map((e, uid) => ({...e, uid})));
        return {entries, engine};
      });
    cache.catch(() => {
      cache = undefined; // allow a retry
    });
  }
  return cache;
}

// loads the index the first time `wanted` becomes true
export function useSearchIndex(wanted) {
  const url = useBaseUrl('/search-index.json');
  const [state, setState] = useState({status: 'idle'});

  useEffect(() => {
    if (!wanted || state.status !== 'idle') return;
    setState({status: 'loading'});
    load(url)
      .then((data) => setState({status: 'ready', ...data}))
      .catch(() => setState({status: 'error'}));
  }, [wanted]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

export function runSearch({entries, engine}, query, chapter) {
  const hits = engine.search(query.trim(), {filter: (r) => !chapter || r.chapter === chapter});
  return hits.slice(0, 30).map((h) => ({...entries[h.id]}));
}