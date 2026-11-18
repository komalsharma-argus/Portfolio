import chapters from '@site/src/data/chapters.json';
import counts from '@site/src/data/page-counts.json';

const cache = {};
const valid = (item, chapter, profile) =>
  !!item && item.hash === chapter.hash && item.size === `${profile.w}x${profile.h}`;

// first page number of every chapter in a profile.
// null once an earlier chapter is missing or out of date (its count is unknown)
export function startsFor(profile) {
  if (cache[profile.id]) return cache[profile.id];
  const starts = {};
  let next = 1;
  chapters.forEach((c) => {
    starts[c.key] = next;
    const item = counts[profile.id]?.[c.key];
    if (next === null || !valid(item, c, profile)) {
      next = null;
      return;
    }
    // two-page profiles: a chapter fills whole spreads, so left pages stay odd
    next += profile.per === 2 ? item.pages + (item.pages % 2) : item.pages;
  });
  cache[profile.id] = starts;
  return starts;
}