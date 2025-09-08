/* app.js: alla klient-funktioner (voting, likes, dark-mode, carousel, weather, forms, scroll-top, input-reflection) */

document.addEventListener('DOMContentLoaded', () => {
  // -- Mobile menu toggle (reused across pages)
  const toggles = document.querySelectorAll('.hamburger');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.nav-inner').querySelector('.nav');
      nav.classList.toggle('show');
    });
  });

  // -- Theme (dark/light) using localStorage
  const themeButtons = document.querySelectorAll('[id^="themeToggle"]');
  const applyTheme = (mode) => {
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('site.theme', mode);
  };
  const initTheme = () => {
    const saved = localStorage.getItem('site.theme') || 'light';
    applyTheme(saved);
  };
  themeButtons.forEach(b => b.addEventListener('click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }));
  initTheme();

  // -- Dark theme CSS variables (applied via [data-theme="dark"])
  const darkCss = document.createElement('style');
  darkCss.textContent = `
    :root[data-theme="dark"]{
      --bg: #071126;
      --card: #0b1220;
      --muted: #94a3b8;
      --accent: #22c55e;
      --accent-2: #7dd3fc;
      --text: #e6eef8;
      --glass: rgba(10,12,16,0.5);
    }
    :root[data-theme="dark"] .site-header { background: linear-gradient(180deg, rgba(12,18,30,0.85), rgba(12,18,30,0.8)); color:var(--text); }
  `;
  document.head.appendChild(darkCss);

  // -- Like buttons (localStorage)
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(btn => {
    const id = btn.dataset.id;
    const countEl = btn.querySelector('.counter');
    const stored = parseInt(localStorage.getItem(`likes.${id}`) || '0', 10);
    countEl.textContent = stored;
    btn.addEventListener('click', () => {
      let current = parseInt(localStorage.getItem(`likes.${id}`) || '0', 10);
      current += 1;
      localStorage.setItem(`likes.${id}`, String(current));
      countEl.textContent = current;
      btn.classList.add('liked');
      btn.setAttribute('aria-pressed','true');
    });
  });

  // -- Voting system
  const voteForm = document.getElementById('voteForm');
  if (voteForm) {
    const voteResult = document.getElementById('voteResult');
    voteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sel = document.getElementById('teamOption');
      const val = sel.value;
      if (!val) {
        voteResult.textContent = 'Välj ett alternativ först.';
        voteResult.style.color = 'crimson';
        return;
      }
      const key = `votes.${val}`;
      const cur = parseInt(localStorage.getItem(key) || '0', 10) + 1;
      localStorage.setItem(key, String(cur));
      voteResult.style.color = '';
      voteResult.textContent = `Tack! ${val} har nu ${cur} röster.`;
    });
  }

  // -- Contact form validation + "show input on page" feature
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactResult = document.getElementById('contactResult');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('nameInput');
      if (!name.value || name.value.trim().length < 2) {
        name.focus();
        contactResult.textContent = 'Ange ett giltigt namn (minst 2 tecken).';
        contactResult.style.color = 'crimson';
        return;
      }
      // Successful: show info on page (append)
      const role = document.getElementById('roleInput').value || 'N/A';
      const msg = document.getElementById('messageInput').value || '';
      const out = document.createElement('div');
      out.className = 'profile-snippet';
      out.innerHTML = `<strong>${escapeHtml(name.value)}</strong> — ${escapeHtml(role)}<div class="muted small">${escapeHtml(msg)}</div>`;
      contactResult.style.color = '';
      contactResult.textContent = 'Tack! Din info visas nedan.';
      contactResult.appendChild(out);
      contactForm.reset();
    });
  }

  // -- Members page: input -> show on page
  const applyProfile = document.getElementById('applyProfile');
  if (applyProfile) {
    applyProfile.addEventListener('click', () => {
      const n = document.getElementById('editName').value.trim();
      const c = document.getElementById('editCity').value.trim();
      const out = document.getElementById('profileOutput');
      if (!n && !c) { out.textContent = 'Fyll i minst ett fält.'; return; }
      out.innerHTML = `<p>Visar: <strong>${escapeHtml(n || '—')}</strong> från <em>${escapeHtml(c || '—')}</em></p>`;
    });
  }

  // -- Scroll to top button
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollTopBtn.style.display = 'block';
    else scrollTopBtn.style.display = 'none';

    // add scroll effect: fade-in elements
    document.querySelectorAll('.fade-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) el.classList.add('visible');
    });
  });
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // -- Simple carousel
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slidesWrap = carousel.querySelector('.slides');
    const slides = carousel.querySelectorAll('.slide');
    let idx = 0;
    const update = () => { slidesWrap.style.transform = `translateX(-${idx * 100}%)`; };
    carousel.querySelector('.carousel-next').addEventListener('click', () => { idx = (idx+1) % slides.length; update(); });
    carousel.querySelector('.carousel-prev').addEventListener('click', () => { idx = (idx-1+slides.length) % slides.length; update(); });
    // auto-advance
    setInterval(()=>{ idx = (idx+1) % slides.length; update(); }, 5000);
  }

  // -- Simple image lazy load fallback (add class for animation)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => img.classList.add('loaded'));
  });

  // -- Weather (OpenWeatherMap) — replace API_KEY below with your key
  const weatherCard = document.getElementById('weatherCard');
  const fetchWeather = async (city='Stockholm') => {
    if (!weatherCard) return;
    const API_KEY = 'PASTA_IN_DIN_OPENWEATHERMAP_KEY_HÄR';
    if (!API_KEY || API_KEY.includes('PASTA_IN')) {
      weatherCard.innerHTML = '<div class="weather-loading">Sätt in din OpenWeatherMap API-nyckel i app.js för att visa aktuellt väder.</div>';
      return;
    }
    try {
      const q = encodeURIComponent(city);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${API_KEY}&lang=sv`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      weatherCard.innerHTML = `<div class="weather-main"><strong>${data.name}</strong> — ${Math.round(data.main.temp)}°C, ${data.weather[0].description}</div>`;
    } catch (err) {
      weatherCard.innerHTML = `<div class="weather-loading">Kunde inte hämta väder: ${escapeHtml(err.message)}</div>`;
    }
  };
  fetchWeather();

  // -- Form helper: escape HTML
  function escapeHtml(s='') {
    return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // -- small utility: animate elements on load
  document.querySelectorAll('.member-card').forEach((c, i) => {
    c.style.animation = `fadeUp 600ms ease ${i*80}ms both`;
  });

  // Accessibility: ensure focusable interactive elements
  document.querySelectorAll('button, a, input, select').forEach(el => el.setAttribute('tabindex', '0'));
});
