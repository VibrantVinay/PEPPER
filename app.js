const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

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
      ? 'Email delivery is not configured yet. Please email exports@malabarcrown.example.'
      : error.message;
  } finally { button.disabled = false; }
});

const dialog = document.querySelector('#adminDialog');
document.querySelector('.admin-open').addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
const adminForm = document.querySelector('#adminForm');
adminForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = adminForm.querySelector('button[type="submit"]');
  const status = document.querySelector('#adminStatus');
  const values = Object.fromEntries(new FormData(adminForm));
  button.disabled = true; status.textContent = 'Saving securely…';
  try {
    const response = await fetch('/api/admin/brevo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to save settings.');
    adminForm.reset(); status.textContent = 'Settings saved. New contact enquiries will be emailed to the admin address.';
  } catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; }
});
