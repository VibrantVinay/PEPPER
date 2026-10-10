(() => {
  const logoPath = '/assets/totp-logo.svg';
  const candidates = [...document.querySelectorAll('a, [class*="brand" i], [class*="logo" i], [id*="brand" i], [id*="logo" i]')];
  const roots = candidates.filter((element) => /totp/i.test(element.textContent || '') && /pepper|thalassery|exports|origin/i.test(element.textContent || ''));

  roots.forEach((root) => {
    root.querySelectorAll('img').forEach((image) => {
      image.src = logoPath;
      image.alt = 'TOTP';
    });

    root.querySelectorAll('svg').forEach((svg) => {
      const mark = document.createElement('img');
      mark.src = logoPath;
      mark.alt = 'TOTP';
      if (svg.className && typeof svg.className === 'object') mark.className = svg.className.baseVal;
      else if (typeof svg.className === 'string') mark.className = svg.className;
      mark.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      svg.replaceWith(mark);
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || '';
      if (/^\s*M(?:\s|$)/.test(value)) node.nodeValue = value.replace(/^(\s*)M/, '$1T');
    }
  });

  // Catch marks built from text or CSS even when the brand wordmark is hidden on mobile.
  const markNodes = [...document.querySelectorAll('header *, footer *, nav *, [class*="logo" i], [class*="brand" i], [class*="mark" i], [id*="logo" i], [id*="brand" i]')];
  markNodes.forEach((element, index) => {
    const identity = `${element.className?.baseVal || element.className || ''} ${element.id || ''}`.toLowerCase();
    const isMark = /logo|brand|mark|monogram|symbol/.test(identity);
    if (!isMark) return;

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      const value = textNode.nodeValue || '';
      if (/^\s*M\s*$/.test(value)) textNode.nodeValue = value.replace('M', 'T');
    }

    ['::before', '::after'].forEach((pseudo) => {
      const content = getComputedStyle(element, pseudo).content.replace(/["']/g, '').trim();
      if (content !== 'M') return;
      if (!element.id) element.id = `totp-letter-mark-${index}`;
      let style = document.getElementById('totp-logo-letter-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'totp-logo-letter-style';
        document.head.appendChild(style);
      }
      style.textContent += `#${CSS.escape(element.id)}${pseudo}{content:"T"!important}`;
    });
  });
})();
