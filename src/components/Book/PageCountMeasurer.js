import {useEffect} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {currentLayout, layoutKey, nextMissing, report, resetLayout} from './pageCounts';

const START_DELAY = 2500; // let the page settle first
const PAUSE = 400; // breathing room between chapters
const TIMEOUT = 30000;

export default function PageCountMeasurer() {
  const docsBase = useBaseUrl('/docs/');

  useEffect(() => {
    const embedded = window.self !== window.top || new URLSearchParams(window.location.search).has('measure');
    if (embedded) return undefined; // the hidden frames never start measuring themselves

    let cancelled = false;
    let running = false;
    let timer;

    const measureOne = (key, started) =>
      new Promise((resolve) => {
        const frame = document.createElement('iframe');
        frame.src = `${docsBase}${encodeURI(key)}?measure=1`;
        frame.tabIndex = -1;
        frame.setAttribute('aria-hidden', 'true');
        Object.assign(frame.style, {
          position: 'fixed',
          left: '-10000px',
          top: '0',
          width: `${window.innerWidth}px`,
          height: `${window.innerHeight}px`,
          border: '0',
          visibility: 'hidden',
          pointerEvents: 'none',
        });
        let finished = false;
        let timeout;
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(timeout);
          window.removeEventListener('message', onMessage);
          frame.remove();
          resolve();
        };
        const onMessage = (e) => {
          if (e.source !== frame.contentWindow || e.data?.type !== 'book-pages') return;
          if (layoutKey() === started) report(e.data.key, e.data.pages, e.data.per);
          finish();
        };
        timeout = setTimeout(finish, TIMEOUT);
        window.addEventListener('message', onMessage);
        document.body.appendChild(frame);
      });

    const run = async () => {
      if (running || cancelled) return;
      running = true;
      const started = layoutKey();
      const here = decodeURI(window.location.pathname).replace(/\/$/, '');
      const tried = new Set();
      // the chapter you are reading reports its own count
      const own = nextMissing(new Set());
      if (own && here.endsWith(`/docs/${own}`)) tried.add(own);
      let key = nextMissing(tried);
      while (key && !cancelled && layoutKey() === started) {
        tried.add(key);
        // eslint-disable-next-line no-await-in-loop
        await measureOne(key, started);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, PAUSE));
        key = nextMissing(tried);
      }
      running = false;
      if (!cancelled && layoutKey() !== started) {
        resetLayout();
        run();
      }
    };

    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (layoutKey() !== currentLayout()) resetLayout();
        run();
      }, 1000);
    };

    window.addEventListener('resize', onResize);
    timer = setTimeout(run, START_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [docsBase]);

  return null;
}