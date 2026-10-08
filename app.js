const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const setMenuOpen = open => {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuButton.addEventListener('click', () => {
  setMenuOpen(!nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('click', event => {
  if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenuOpen(false); });
document.querySelector('#year').textContent = new Date().getFullYear();

// Small progressive enhancements: content remains visible when JS or motion support is unavailable.
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
const header = document.querySelector('.site-header');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 12);
    scrollTicking = false;
  });
}, { passive: true });

const revealTargets = document.querySelectorAll('main > section:not(.hero), .product-card, .journey-steps article, .number-grid > div, .trust-bar > div, .contact-details > div');
revealTargets.forEach((element, index) => {
  element.dataset.reveal = '';
  if (element.matches('.product-card, .journey-steps article, .number-grid > div, .trust-bar > div, .contact-details > div')) {
    element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
  }
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'));
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || !entry.target.id) return;
    sectionLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-22% 0px -68% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => activeObserver.observe(section));
}

const cookieBanner = document.querySelector('#cookieBanner');
const cookieChoice = document.cookie.match(/(?:^|;\s*)site_cookie_consent=(accepted|declined)(?:;|$)/);
if (!cookieChoice) {
  window.setTimeout(() => {
    cookieBanner.classList.add('visible');
    cookieBanner.setAttribute('aria-hidden', 'false');
  }, 500);
}
function saveCookieChoice(choice) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `site_cookie_consent=${choice}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  cookieBanner.classList.remove('visible');
  cookieBanner.setAttribute('aria-hidden', 'true');
}
document.querySelector('#cookieAccept').addEventListener('click', () => saveCookieChoice('accepted'));
document.querySelector('#cookieDecline').addEventListener('click', () => saveCookieChoice('declined'));

const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  formStatus.textContent = 'Sending your enquiry…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not send your enquiry.');
    contactForm.reset();
    formStatus.textContent = 'Thank you — your enquiry has been sent. We’ll be in touch soon.';
  } catch (error) {
    formStatus.textContent = error.message === 'Failed to fetch'
      ? 'Email delivery is not available right now. Please try again later.'
      : error.message;
  } finally { button.disabled = false; }
});

