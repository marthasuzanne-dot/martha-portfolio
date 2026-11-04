/* Password gate for protected case studies.
   Add to the page's <head>: <script src="../assets/js/protect.js"></script>
   This is a light gate for a static site. It keeps casual visitors out, but the page source is still public. */
(function () {
  var KEY = 'ma-case-unlocked';
  var HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';
  try { if (sessionStorage.getItem(KEY) === HASH) return; } catch (e) {}

  var root = document.documentElement;
  root.classList.add('pw-locked');
  var css = document.createElement('style');
  css.textContent =
    '.pw-locked body > *:not(.pw-gate):not(nav):not(header):not(.progress-bar){display:none !important}' +
    '.pw-gate{min-height:100vh;display:grid;place-items:center;padding:110px 24px 24px;background:var(--paper,#fff)}' +
    '.pw-card{width:100%;max-width:420px;padding:40px;border:1px solid var(--teal-pale,#d8e4e2);border-radius:12px;background:var(--paper,#fff)}' +
    '.pw-card h1{font:600 28px/1.2 var(--serif,Georgia,serif);color:var(--ink,#1C2B22);margin:0 0 24px}' +
    '.pw-card p{font:400 16px/1.6 var(--sans,system-ui,sans-serif);color:var(--slate,#3B4D4B);margin:0 0 24px}' +
    '.pw-card label{display:block;font:500 13px/1.4 var(--sans,system-ui,sans-serif);color:var(--slate,#3B4D4B);margin-bottom:8px}' +
    '.pw-row{display:flex;gap:10px}' +
    '.pw-row input{flex:1;min-width:0;height:46px;padding:0 14px;font:400 16px var(--sans,system-ui,sans-serif);color:var(--ink,#1C2B22);border:1px solid var(--teal-pale,#c9d8d5);border-radius:8px;background:#fff}' +
    '.pw-row input:focus{outline:2px solid var(--teal,#3D7872);outline-offset:1px}' +
    '.pw-row button{height:46px;padding:0 20px;font:500 14px var(--sans,system-ui,sans-serif);color:#fff;background:var(--teal,#3D7872);border:0;border-radius:8px;cursor:pointer}' +
    '.pw-row button:hover{background:var(--teal-deep,#2c5e59)}' +
    '.pw-err{min-height:22px;margin-top:10px;font:400 14px/1.5 var(--sans,system-ui,sans-serif);color:#b3261e}' +
    '.pw-back{display:inline-block;margin-top:18px;font:400 14px var(--sans,system-ui,sans-serif);color:var(--teal,#3D7872)}';
  document.head.appendChild(css);

  function sha256(text) {
    if (!window.crypto || !crypto.subtle) return Promise.resolve(text === '1234' ? HASH : '');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function mount() {
    var gate = document.createElement('main');
    gate.className = 'pw-gate';
    gate.innerHTML =
      '<form class="pw-card" novalidate>' +
        '<h1>This case study is password protected</h1>' +
        '<label for="pw-input">Password</label>' +
        '<div class="pw-row"><input id="pw-input" name="case-access" type="password" autocomplete="new-password" autocorrect="off" autocapitalize="off" spellcheck="false" data-1p-ignore data-lpignore="true" required><button type="submit">View</button></div>' +
        '<div class="pw-err" role="alert" aria-live="polite"></div>' +
        '<a class="pw-back" href="../index.html#work">Back to all work</a>' +
      '</form>';
    document.body.prepend(gate);
    var form = gate.querySelector('form'), input = gate.querySelector('input'), err = gate.querySelector('.pw-err');
    input.value = ''; setTimeout(function () { input.value = ''; }, 300); // clear anything a password manager filled in
    input.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sha256(input.value.trim()).then(function (h) {
        if (h === HASH) {
          try { sessionStorage.setItem(KEY, HASH); } catch (x) {}
          gate.remove(); root.classList.remove('pw-locked'); window.scrollTo(0, 0);
          window.dispatchEvent(new Event('resize')); // the page was hidden, so anything sized on load measures again
        } else {
          err.textContent = "That password didn't work. Try again.";
          input.select();
        }
      });
    });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
