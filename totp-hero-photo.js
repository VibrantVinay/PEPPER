(() => {
  const photo = 'https://images.unsplash.com/photo-1755598603006-5cee23c4cb4e?auto=format&fit=crop&w=1800&q=85';
  const applyHeroPhoto = () => {
    const title = [...document.querySelectorAll('h1')].find((node) => /thalassery|good pepper/i.test(node.textContent || ''));
    if (!title) return;

    const section = title.closest('section') || title.closest('main') || title.parentElement;
    if (!section) return;

    const images = [...section.querySelectorAll('img')].filter((img) => !/logo|mark/i.test(img.alt || ''));
    let image = images.find((img) => {
      const titlePosition = title.compareDocumentPosition(img);
      return Boolean(titlePosition & Node.DOCUMENT_POSITION_PRECEDING);
    }) || images[0];

    if (!image) {
      image = document.createElement('img');
      image.alt = 'Close-up of Thalassery black peppercorns';
      image.loading = 'eager';
      image.decoding = 'async';
      title.parentElement.insertBefore(image, title);
    }

    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.src = photo;
    image.alt = 'Close-up of dried black peppercorns';
    image.style.setProperty('display', 'block', 'important');
    image.style.setProperty('width', '100%', 'important');
    image.style.setProperty('height', 'clamp(15rem, 43vw, 29rem)', 'important');
    image.style.setProperty('object-fit', 'cover', 'important');
    image.style.setProperty('object-position', 'center 54%', 'important');
    image.style.setProperty('border-radius', '1.25rem', 'important');
    image.style.setProperty('background', '#e9e5d8', 'important');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroPhoto, { once: true });
  } else {
    applyHeroPhoto();
  }
})();
