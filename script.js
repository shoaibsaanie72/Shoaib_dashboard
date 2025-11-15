
// ---------- Utility ----------
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

// ---------- Progress bars (skills page) ----------
function animateProgressBars() {
    const bars = qsa('.progress');
    if (!bars.length) return;
    bars.forEach(bar => {
        const fill = bar.querySelector('.progress-fill');
        const target = parseInt(bar.dataset.percent || 0, 10);
        // animate with requestAnimationFrame for smooth progress
        let start = null;
        const duration = 900 + (target * 6); // a bit longer for bigger numbers
        function step(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const pct = Math.min(1, elapsed / duration);
            fill.style.width = (pct * target) + '%';
            if (pct < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

// If on skills page, animate bars after DOM load
document.addEventListener('DOMContentLoaded', () => {
    animateProgressBars();
    setupProjectFilter();
    setupThemeToggle();
    setupFormValidation();
    setupClockAndSession();
});

// ---------- Project filter (projects page) ----------
function setupProjectFilter() {
    const filter = qs('#techFilter');
    if (!filter) return;
    const grid = qs('#projectsGrid');
    filter.addEventListener('change', () => {
        const val = filter.value;
        const projects = qsa('.project', grid);
        projects.forEach(p => {
            const tech = p.dataset.tech || 'all';
            if (val === 'all' || tech === val) {
                p.style.display = '';
                p.classList.add('show');
            } else {
                p.style.display = 'none';
                p.classList.remove('show');
            }
        });
    });
}

// ---------- Theme toggle (Home page only) ----------
// ---------- Theme toggle (persistent across pages) ----------
// ---------- Theme toggle (persistent across pages) ----------
function setupThemeToggle() {
  const body = document.body;
  const btn = qs('#themeToggle');
  
  // Apply saved theme when page loads
  const saved = localStorage.getItem('arz-theme');
  if (saved) body.className = saved;

  // If theme toggle button exists (on home page)
  if (btn) {
    btn.addEventListener('click', () => {
      if (body.classList.contains('theme-dark')) {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        localStorage.setItem('arz-theme','theme-light');
      } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        localStorage.setItem('arz-theme','theme-dark');
      }
      btn.blur();
    });
  }
}

// ---------- Contact form validation ----------
function setupFormValidation() {
    const form = qs('#contactForm');
    if (!form) return;
    const note = qs('#formNote');

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        note.textContent = '';
        const name = qs('#name').value.trim();
        const email = qs('#email').value.trim();
        const message = qs('#message').value.trim();

        const errs = [];
        if (name.length < 2) errs.push('Name must be at least 2 characters.');
        if (!validateEmail(email)) errs.push('Enter a valid email address.');
        if (message.length < 10) errs.push('Message is too short (min 10 characters).');

        if (errs.length) {
            note.textContent = errs.join(' ');
            note.style.color = '#ff7070';
            return;
        }

        // Simulate sending (for assignment). In a real app you'd fetch() to an API.
        note.textContent = 'Message sent! (simulated)';
        note.style.color = '#4ad28e';
        form.reset();
        setTimeout(() => note.textContent = '', 4000);
    });
}

function validateEmail(email) {
    // Simple but effective regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(email);
}

// ---------- Digital Clock + Session Timer ----------
function setupClockAndSession() {
    const clockEl = qs('#digitalClock');
    const timerEl = qs('#sessionTimer');
    if (!clockEl || !timerEl) return;

    // Digital clock
    function updateClock() {
        const now = new Date();
        clockEl.textContent = 'Clock: ' + now.toLocaleTimeString();
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Session timer: counts seconds while document is visible/focused
    let seconds = 0;
    let intervalId = null;

    function startTimer() {
        if (intervalId) return;
        intervalId = setInterval(() => {
            seconds++;
            timerEl.textContent = 'Session: ' + formatMMSS(seconds);
        }, 1000);
    }
    function stopTimer() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Start when page loaded and visible
    if (!document.hidden) startTimer();

    // Use visibilitychange to pause timer when user moves away
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    // Also pause when window loses focus and resume when gains focus
    window.addEventListener('blur', stopTimer);
    window.addEventListener('focus', () => { if (!document.hidden) startTimer(); });

    // Format mm:ss
    function formatMMSS(s) {
        const mm = Math.floor(s / 60).toString().padStart(2, '0');
        const ss = (s % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    }
}

// ---------- Accessibility enhancements (optional) ----------
// Add keyboard focus style to links/buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus-outline');
});

// END of script.js
