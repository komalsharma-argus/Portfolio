import React, {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import chapters from '@site/src/data/chapters.json';
import {PROFILES} from '@site/src/components/Book/profiles';

const SETTLE_MS = 1500; // the count must stay unchanged this long
const TIMEOUT_MS = 45000;

export default function Calibrate() {
  const docsBase = useBaseUrl('/docs/');
  const [results, setResults] = useState({});
  const [status, setStatus] = useState('Ready');
  const [running, setRunning] = useState(false);
  const stop = useRef(false);

  const measure = (profile, chapter) =>
    new Promise((resolve) => {
      const frame = document.createElement('iframe');
      frame.src = `${docsBase}${encodeURI(chapter.key)}?measure=1&profile=${profile.id}`;
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      Object.assign(frame.style, {
        position: 'fixed', left: '-10000px', top: '0', width: '1700px', height: '1000px',
        border: '0', visibility: 'hidden', pointerEvents: 'none',
      });
      let pages = null;
      let settle;
      let finished = false;
      const finish = (value) => {
        if (finished) return;
        finished = true;
        clearTimeout(settle);
        clearTimeout(limit);
        window.removeEventListener('message', onMessage);
        frame.remove();
        resolve(value);
      };
      const onMessage = (e) => {
        const d = e.data;
        if (e.source !== frame.contentWindow || d?.type !== 'book-pages') return;
        if (d.profile !== profile.id || d.key !== chapter.key) return;
        pages = d.pages;
        clearTimeout(settle);
        settle = setTimeout(() => finish(pages), SETTLE_MS);
      };
      const limit = setTimeout(() => finish(pages), TIMEOUT_MS);
      window.addEventListener('message', onMessage);
      document.body.appendChild(frame);
    });

  const run = async () => {
    setRunning(true);
    stop.current = false;
    const out = {};
    const total = PROFILES.length * chapters.length;
    let n = 0;
    for (const p of PROFILES) {
      out[p.id] = {};
      for (const c of chapters) {
        if (stop.current) break;
        n += 1;
        setStatus(`${p.id} · ${c.title} (${n}/${total})`);
        // eslint-disable-next-line no-await-in-loop
        const pages = await measure(p, c);
        if (pages) out[p.id][c.key] = {hash: c.hash, size: `${p.w}x${p.h}`, pages};
        setResults(JSON.parse(JSON.stringify(out)));
      }
    }
    setStatus(stop.current ? 'Stopped' : 'Done: download the file and save it as src/data/page-counts.json');
    setRunning(false);
  };

  const download = () => {
    const blob = new Blob([`${JSON.stringify(results, null, 2)}\n`], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-counts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Calibrate page counts">
      <main style={{padding: '2rem', maxWidth: 900, margin: '0 auto'}}>
        <h1>Calibrate page counts</h1>
        <p>
          Measures every chapter in every page layout and saves the result as <code>src/data/page-counts.json</code>.
          Run it after changing the docs. Keep this tab open until it says Done.
        </p>
        <p>
          <button className="button button--primary" disabled={running} onClick={run}>Measure all</button>{' '}
          <button className="button button--secondary" disabled={!running} onClick={() => { stop.current = true; }}>Stop</button>{' '}
          <button className="button button--secondary" disabled={running || !Object.keys(results).length} onClick={download}>
            Download page-counts.json
          </button>
        </p>
        <p><strong>{status}</strong></p>
        <table>
          <thead>
            <tr>
              <th>Chapter</th>
              {PROFILES.map((p) => <th key={p.id}>{p.id}</th>)}
            </tr>
          </thead>
          <tbody>
            {chapters.map((c) => (
              <tr key={c.key}>
                <td>{c.title}</td>
                {PROFILES.map((p) => <td key={p.id}>{results[p.id]?.[c.key]?.pages ?? '–'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Layout>
  );
}