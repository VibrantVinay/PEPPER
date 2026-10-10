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
})();
