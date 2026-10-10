(() => {
  const products = [
    { name: 'Turmeric & Ginger', image: '/assets/turmeric-ginger.svg', alt: 'Fresh turmeric and ginger roots' },
    { name: 'Cardamom & More', image: '/assets/cardamom.svg', alt: 'Green cardamom pods and whole spices' },
  ];

  function restoreProduct(product) {
    const matches = [...document.querySelectorAll('h1,h2,h3,h4,h5,a,li,article,div,span,p')]
      .filter((element) => (element.textContent || '').toLowerCase().includes(product.name.toLowerCase()));
    const label = matches.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length)[0];

    if (!label) return null;

    let card = label;
    while (card.parentElement && !card.querySelector('img, picture, [role="img"]')) {
      card = card.parentElement;
      if (card === document.body) return null;
    }

    card.removeAttribute('hidden');
    card.removeAttribute('aria-hidden');
    card.classList.remove('hidden', 'is-hidden', 'product-hidden');
    card.style.removeProperty('display');
    card.style.setProperty('display', 'block', 'important');
    card.classList.add('totp-restored-spice-card');

    const image = card.querySelector('img');
    if (image) {
      image.removeAttribute('hidden');
      image.removeAttribute('aria-hidden');
      image.style.removeProperty('display');
      if (!image.getAttribute('src') || image.getAttribute('src').startsWith('data:image/svg')) image.src = product.image;
      if (!image.alt) image.alt = product.alt;
      image.addEventListener('error', () => {
        image.src = product.image;
      }, { once: true });
    }

    return card;
  }

  function restore() {
    products.forEach(restoreProduct);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restore, { once: true });
  } else {
    restore();
  }
})();
