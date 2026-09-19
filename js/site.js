/* ============================================
   AI2DATA — SITE SCRIPT (all pages)
   ============================================ */
'use strict';

/* Mobile navigation */
(function () {
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  }
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
})();

/* Contact form — EmailJS */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  if (typeof emailjs === 'undefined') { console.warn('EmailJS not loaded'); return; }

  emailjs.init({ publicKey: 'Bk7J-VNoVf60Ct3a-' });

  function say(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.innerHTML;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    say('');

    var data = new FormData(form);
    var params = {
      first_name: data.get('first_name') || '',
      last_name:  data.get('last_name')  || '',
      email:      data.get('email')      || '',
      phone:      data.get('phone')      || '',
      company:    data.get('company')    || '',
      service:    data.get('service')    || '',
      message:    data.get('message')    || ''
    };

    try {
      await emailjs.send('service_oauoyqm', 'template_ntjidxo', params);
      form.reset();
      say('Message sent. A senior consultant will reply within 24 hours.', 'ok');
    } catch (err) {
      console.error('EmailJS error:', err && err.status, err && err.text, err);
      say('Your message didn’t send. Check your connection and try again, or email support@theai2data.com.', 'err');
    } finally {
      btn.innerHTML = label;
      btn.disabled = false;
    }
  });
})();
