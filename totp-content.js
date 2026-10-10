(() => {
  const applyTotpContent = () => {
    if (document.getElementById('totp-journey')) return;

    const bodyText = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (bodyText.nextNode()) textNodes.push(bodyText.currentNode);

    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue
        .replace(/Malabar Crown/gi, 'TOTP')
        .replace(/Kozhikode/gi, 'Thalassery')
        .replace(/Distinctive by nature\.?/gi, 'Thalassery pepper, prepared for trade.')
        .replace(/Need a particular origin, cut or specification\?/gi, 'Need a grade, pack format or destination specification?');

      if (/SPICE EXPORTS\s*[·•]\s*THALASSERY/i.test(node.nodeValue)) {
        node.nodeValue = 'PEPPER EXPORTS · THALASSERY ORIGIN';
      }
      if (/PEPPER AND SPICES FROM KOZHIKODE/i.test(node.nodeValue)) {
        node.nodeValue = 'THALASSERY ORIGIN · MALABAR COAST';
      }
    });

    document.querySelectorAll('[alt], [title], [aria-label]').forEach((element) => {
      ['alt', 'title', 'aria-label'].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && /Kozhikode/i.test(value)) {
          element.setAttribute(attribute, value.replace(/Kozhikode/gi, 'Thalassery'));
        }
      });
    });

    const brandLeaves = document.querySelectorAll('header *, footer *, [class*="brand"] *, [class*="logo"] *');
    brandLeaves.forEach((element) => {
      if (element.children.length === 0 && /MALABAR\s+CROWN/i.test(element.textContent)) {
        element.textContent = 'TOTP';
      }
    });

    document.querySelectorAll('header *, footer *, header svg text, footer svg text').forEach((element) => {
      if (element.children.length === 0 && element.textContent.trim() === 'M') {
        element.textContent = 'T';
        element.classList.add('totp-logo-letter');
      }
    });

    const hero = document.querySelector('main > section:first-of-type, main .hero, main .hero-section');
    if (hero) {
      const title = hero.querySelector('h1');
      if (title) title.innerHTML = 'Thalassery pepper,<br><em>from its origin.</em>';

      const copy = Array.from(hero.querySelectorAll('p')).find((paragraph) =>
        /We source black pepper|buyers around the world/i.test(paragraph.textContent)
      );
      if (copy) {
        copy.textContent = 'We bring Thalassery-origin pepper to buyers with clear specifications, careful preparation and export coordination.';
      }

      const images = Array.from(document.querySelectorAll('img'));
      const actualPepperImage = images.find((image) =>
        /pepper|spice/i.test(`${image.alt} ${image.currentSrc} ${image.src}`)
        && !/malabar-hero-fallback|totp-logo/i.test(`${image.alt} ${image.currentSrc} ${image.src}`)
      ) || images.find((image) => image.closest('[class*="product"]')
        && !/malabar-hero-fallback|totp-logo/i.test(`${image.alt} ${image.currentSrc} ${image.src}`));
      const heroImage = hero.querySelector('picture img, figure img, img:not([alt*="logo" i])');
      const heroMedia = hero.querySelector('.hero-visual, .hero-image, .hero-media, .hero-art, .hero-photo, figure, picture');
      if (actualPepperImage && heroImage && /malabar-hero-fallback/i.test(`${heroImage.currentSrc} ${heroImage.src}`)) {
        heroImage.src = actualPepperImage.currentSrc || actualPepperImage.src;
        heroImage.removeAttribute('srcset');
      }
      if (actualPepperImage && heroMedia) {
        heroMedia.style.setProperty('background-image', `url("${actualPepperImage.currentSrc || actualPepperImage.src}")`, 'important');
        heroMedia.style.setProperty('background-size', 'cover', 'important');
        heroMedia.style.setProperty('background-position', 'center', 'important');
        heroMedia.setAttribute('role', 'img');
        heroMedia.setAttribute('aria-label', actualPepperImage.alt || 'Thalassery pepper and spices');
      }
    }

    document.title = 'TOTP | Thalassery Origin Thalassery Pepper';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = 'Discover how TOTP brings Thalassery-origin pepper to buyers, from lot selection and preparation to export coordination.';
    }

    document.querySelectorAll('article, [class*="product-card"], [class*="product-item"]').forEach((card) => {
      if (/turmeric|ginger|cardamom/i.test(card.textContent)) card.hidden = true;
    });

    const journey = document.createElement('section');
    journey.className = 'totp-journey';
    journey.id = 'totp-journey';
    journey.innerHTML = `
      <div class="totp-journey__intro">
        <p class="totp-journey__eyebrow">FROM ORIGIN TO ORDER</p>
        <h2>Thalassery pepper, ready for your market.</h2>
        <p>We make the route from pepper-growing origin to export order clear, with product and shipment details agreed with each buyer.</p>
      </div>
      <ol class="totp-journey__steps">
        <li><span>01</span><div><h3>Select the lot</h3><p>Start with Thalassery-origin pepper and the grade or product form your market needs.</p></div></li>
        <li><span>02</span><div><h3>Prepare to specification</h3><p>Cleaning, drying and sorting are planned around the agreed product specification.</p></div></li>
        <li><span>03</span><div><h3>Confirm grade and packing</h3><p>Grade, pack format and labeling details are confirmed before an order is prepared.</p></div></li>
        <li><span>04</span><div><h3>Coordinate export</h3><p>Destination documents, shipment timing and handoff details are aligned for the order.</p></div></li>
      </ol>
      <aside class="totp-journey__export">
        <div><p class="totp-journey__eyebrow">EXPORT DETAILS</p><h3>Clear terms before dispatch.</h3></div>
        <p>Share your destination, required grade, quantity and preferred pack format. We can confirm the available specification, documentation requirements and shipment plan for your enquiry.</p>
        <a href="#contact">Discuss an export enquiry <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5 4h7v7"/></svg></a>
      </aside>`;

    const contactSection = document.querySelector('#contact, [id*="contact"]')?.closest('section')
      || document.querySelector('form')?.closest('section')
      || document.querySelector('footer');
    const main = document.querySelector('main');
    if (main) {
      if (contactSection && main.contains(contactSection)) main.insertBefore(journey, contactSection);
      else main.appendChild(journey);
    }

    document.querySelectorAll('nav').forEach((nav) => {
      if (!nav.querySelector('#totp-nav-link')) {
        const link = document.createElement('a');
        link.id = 'totp-nav-link';
        link.href = '#totp-journey';
        link.textContent = 'How we prepare';
        nav.appendChild(link);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTotpContent, { once: true });
  } else {
    applyTotpContent();
  }
})();
