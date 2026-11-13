// Sends the contact form to Netlify without leaving the page.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = document.getElementById('form-msg');
  var btn = form.querySelector('button[type=submit]');

  function show(kind, text) {
    msg.className = 'form-msg ' + kind;
    msg.textContent = text;
    msg.hidden = false;
    msg.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending...';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error('bad response');
      form.hidden = true;
      show('ok', 'Thank you. I got your note and will write back soon.');
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = 'Send';
      show('bad', 'Something went wrong. Please try again, or email me directly.');
    });
  });
})();
