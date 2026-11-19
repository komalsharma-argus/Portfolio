import {useEffect, useState} from 'react';

const CHROME_W = 40; // free space left and right of the pages
const CHROME_H = 215; // navbar, footer, header/footer strips and lines above and below the text
const GUTTER = 56; // 3.5rem: the gap between the two pages
const MAX_PAGE_W = 640; // wider lines are hard to read: extra width becomes margin
const SLACK = 8;
const SINGLE_BELOW = 900; // windows narrower than this show one page

// a profile is made for windows at least minW x minH: the text box fills what is left
const make = (id, per, minW, minH) => ({
  id,
  per,
  w: Math.min(MAX_PAGE_W, Math.floor((minW - CHROME_W - (per - 1) * GUTTER) / per / 10) * 10),
  h: Math.floor((minH - CHROME_H) / 10) * 10,
});

// w, h = size of the text box of ONE page, in px. per = pages shown at once. Biggest first.
export const PROFILES = [
  // two pages: laptops and desktops
  make('X8', 2, 1800, 1080),
  make('X7', 2, 1600, 980),
  make('X6', 2, 1500, 900),
  make('X5', 2, 1400, 830),
  make('X4', 2, 1300, 760),
  make('X3', 2, 1200, 690),
  make('X2', 2, 1100, 620),
  make('X1', 2, 1000, 560),
  make('X0', 2, 900, 520),
  // one page: tablets and phones
  make('T2', 1, 700, 900),
  make('T1', 1, 560, 760),
  make('U', 1, 470, 660),
  make('S2', 1, 380, 700),
  {id: 'S', per: 1, w: 280, h: 340}, // small phones: the fallback
];

const SPREADS = PROFILES.filter((p) => p.per === 2);
const SINGLES = PROFILES.filter((p) => p.per === 1);
const DEFAULT_ID = 'X4';
const FALLBACK = {h: CHROME_H, w: CHROME_W}; // used until the book is on screen

// the space around the text box, measured from the page
function chrome() {
  const paper = document.querySelector('[data-book-paper]');
  const sheet = document.querySelector('[data-book-sheet]');
  const view = document.querySelector('[data-book-viewport]');
  if (!paper || !sheet || !view) return FALLBACK;
  return {
    h: window.innerHeight - paper.clientHeight + (sheet.offsetHeight - view.offsetHeight),
    w: Math.max(0, window.innerWidth - paper.clientWidth) + CHROME_W,
  };
}

// phones and tablets: touch is the main input
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export function profileFor(width, height, c = FALLBACK) {
  const group = width < SINGLE_BELOW || isTouchDevice() ? SINGLES : SPREADS;
  const fits = (p) =>
    width >= p.per * p.w + (p.per - 1) * GUTTER + c.w + SLACK && height >= p.h + c.h + SLACK;
  // if nothing fits, the smallest one is used (the page then scrolls instead of being cut)
  return group.find(fits) || group[group.length - 1];
}

// ?profile=X4 forces a profile (used by the calibrate page)
export function useProfile() {
  const [id, setId] = useState(DEFAULT_ID); // same on the server and on the first client render

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('profile');
    const pick = () =>
      (PROFILES.find((p) => p.id === forced) || profileFor(window.innerWidth, window.innerHeight, chrome())).id;
    setId(pick());
    const again = setTimeout(() => setId(pick()), 300); // once the book has been laid out
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setId(pick()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(again);
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return PROFILES.find((p) => p.id === id);
}