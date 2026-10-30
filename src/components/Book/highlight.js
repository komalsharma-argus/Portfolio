const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function clearHighlights(root, className) {
  if (!root) return;
  root.querySelectorAll(`mark.${className}`).forEach((m) => {
    const parent = m.parentNode;
    parent.replaceChild(document.createTextNode(m.textContent), m);
    parent.normalize();
  });
}

// wraps every word starting with one of the terms in <mark>; returns the marks
export function highlightTerms(root, terms, className) {
  clearHighlights(root, className);
  const list = terms.filter((t) => t.length >= 2);
  if (!root || !list.length) return [];

  const re = new RegExp(`(?:${list.map(esc).join('|')})[\\p{L}\\p{N}_]*`, 'giu');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue.trim() && !n.parentElement.closest('script, style, mark')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  const marks = [];
  nodes.forEach((node) => {
    const text = node.nodeValue;
    re.lastIndex = 0;
    let last = 0;
    let frag = null;
    let m;
    while ((m = re.exec(text))) {
      if (!m[0]) {
        re.lastIndex += 1;
        continue;
      }
      if (!frag) frag = document.createDocumentFragment();
      frag.append(text.slice(last, m.index));
      const mark = document.createElement('mark');
      mark.className = className;
      mark.textContent = m[0];
      frag.append(mark);
      marks.push(mark);
      last = m.index + m[0].length;
    }
    if (frag) {
      frag.append(text.slice(last));
      node.parentNode.replaceChild(frag, node);
    }
  });
  return marks;
}