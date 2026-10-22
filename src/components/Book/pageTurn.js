import styles from './pageTurn.module.css';

const ROOT = '[data-book-root]';
const FLIP_MS = 900; // keep in sync with the pageShade animation
const SETTLE_MS = 350; // let the new page finish laying out before copying it
const WAIT_MS = 3000; // give up waiting for the new page after this

let busy = false;

// copy of a page-sized element, positioned inside a half-page window
function copyOf(source, rect, left) {
  const copy = source.cloneNode(true);
  copy.removeAttribute('data-book-root'); // so the copy is never mistaken for the real page
  copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  Object.assign(copy.style, {
    position: 'absolute',
    top: '0',
    left: `${left}px`,
    margin: '0',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
  return copy;
}

const div = (className, css = {}) => {
  const el = document.createElement('div');
  if (className) el.className = className;
  Object.assign(el.style, css);
  return el;
};

function waitForNewPage(old) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const el = document.querySelector(ROOT);
      if (el && el !== old) return resolve(el);
      if (performance.now() - t0 > WAIT_MS) return reject();
      requestAnimationFrame(tick);
    };
    tick();
  });
}

// dir > 0: the right page turns over to the left (forward)
// dir < 0: the left page turns back over to the right
export default function pageTurn(navigate, dir = 1) {
  const old = document.querySelector(ROOT);
  const skip =
    busy ||
    !old ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 996px)').matches;
  if (skip) {
    navigate();
    return;
  }

  busy = true;
  const rect = old.getBoundingClientRect();
  const half = rect.width / 2;
  const flipSide = dir > 0 ? 'right' : 'left';
  const stillSide = dir > 0 ? 'left' : 'right';
  const offset = (side) => (side === 'left' ? 0 : -half);

  const overlay = div(styles.overlay, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });

  // the half that stays put (old page)
  const still = div(styles.still, {left: stillSide === 'left' ? '0' : `${half}px`, width: `${half}px`});
  still.appendChild(copyOf(old, rect, offset(stillSide)));

  // the sheet that turns: front = old page, back = new page (filled in later)
  const flipper = div(styles.flipper, {
    left: flipSide === 'right' ? `${half}px` : '0',
    width: `${half}px`,
    transformOrigin: flipSide === 'right' ? 'left center' : 'right center',
  });
  const front = div(styles.face);
  front.appendChild(copyOf(old, rect, offset(flipSide)));
  const back = div(`${styles.face} ${styles.back}`);
  flipper.append(front, back);

  overlay.append(still, flipper);
  document.body.appendChild(overlay);

  const cleanup = () => {
    overlay.remove();
    busy = false;
  };

  navigate();

  waitForNewPage(old)
    .then((neu) => {
      setTimeout(() => {
        back.appendChild(copyOf(neu, neu.getBoundingClientRect(), offset(stillSide)));
        overlay.classList.add(styles.turning);
        flipper.style.transition = `transform ${FLIP_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`;
        flipper.getBoundingClientRect(); // commit the starting position
        requestAnimationFrame(() => {
          flipper.style.transform = `rotateY(${dir > 0 ? -180 : 180}deg)`;
        });
        const timer = setTimeout(cleanup, FLIP_MS + 400); // safety net
        flipper.addEventListener('transitionend', (e) => {
          if (e.target === flipper && e.propertyName === 'transform') {
            clearTimeout(timer);
            cleanup();
          }
        });
      }, SETTLE_MS);
    })
    .catch(cleanup);
}