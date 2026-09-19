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

/* Free strategy call offer: dismissible bar, and pre-select the offer on the contact form */
(function () {
  var bar = document.getElementById('promo');
  var KEY = 'ai2data-promo-dismissed';
  if (bar) {
    try { if (localStorage.getItem(KEY) === '1') bar.hidden = true; } catch (e) {}
    var x = bar.querySelector('.promo-x');
    if (x) x.addEventListener('click', function () {
      bar.hidden = true;
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  }
  var select = document.getElementById('service');
  if (select && /[?&]offer=free-call\b/.test(window.location.search)) {
    select.value = 'free-strategy-call';
  }
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
      var status = err && err.status, text = (err && err.text) || (err && err.message) || '';
      console.error('EmailJS error:', status, text, err);
      if (!status) {
        // Request never reached EmailJS: offline, or blocked by a browser extension (ad/privacy blockers often block api.emailjs.com).
        say('Your message couldn’t reach our mail service. If you use an ad or privacy blocker, allow this site and try again — or email support@theai2data.com.', 'err');
      } else {
        // Full reason stays in the console; visitors get a short code they can quote.
        say('Your message didn’t send (error ' + status + '). Please email support@theai2data.com or call +91 99948 17615 and we’ll respond within 24 hours.', 'err');
      }
    } finally {
      btn.innerHTML = label;
      btn.disabled = false;
    }
  });
})();
