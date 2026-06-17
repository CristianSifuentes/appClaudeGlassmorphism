/* ─────────────────────────────────────────────────────────────────
   CONTACT FORM — ONE CONFIGURATION LINE
   Sign up at formspree.io, create a new form, copy the endpoint URL.
   Paste it into FORM_ENDPOINT below. Everything else is handled:
   loading state, success confirmation, error with fallback email,
   auto-reset. Leave empty to run in demo mode — no mail is sent.
   ───────────────────────────────────────────────────────────────── */
const FORM_ENDPOINT = ''; // ← e.g. 'https://formspree.io/f/xabcdefg'

// ─── Theme toggle ──────────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme  = localStorage.getItem('theme') ?? (prefersDark ? 'dark' : 'light');
html.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  html.classList.add('theme-transitioning');

  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeToggle.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);

  setTimeout(() => html.classList.remove('theme-transitioning'), 700);
});

// ─── Magnetic cursor ────────────────────────────────────────────
// The moth and its light. Silent on touch screens — never intrudes.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');

  const MAGNETIC_RADIUS   = 140;   // px  — field of attraction around each card
  const MAGNETIC_STRENGTH = 0.16;  // 0–1 — fraction of pull at the very centre
  const lerp = (a, b, t) => a + (b - a) * t;

  let mouseX = 0, mouseY = 0;
  let dotX   = 0, dotY   = 0; // position of the precise inner dot
  let glowX  = 0, glowY  = 0; // position of the trailing outer glow
  let seenFirstMove = false;

  // Snapshot all glass surfaces — they become the attractors
  const glassEls = Array.from(document.querySelectorAll('.glass'));

  // ── Raw mouse tracking ──────────────────────────────────────────
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!seenFirstMove) {
      // Snap both layers to the first known position — no slide from corner
      dotX  = mouseX; dotY  = mouseY;
      glowX = mouseX; glowY = mouseY;
      dot.classList.add('cursor-visible');
      glow.classList.add('cursor-visible');
      seenFirstMove = true;
    }
  });

  // ── Interactive elements change cursor behaviour ─────────────────
  document.querySelectorAll('a, button, label, input, textarea, [role="button"]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-interactive');
      glow.classList.add('is-interactive');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-interactive');
      glow.classList.remove('is-interactive');
    });
  });

  // ── Click — the point concentrates into a spark ──────────────────
  document.addEventListener('mousedown', () => {
    dot.classList.add('is-clicking');
    glow.classList.add('is-clicking');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('is-clicking');
    glow.classList.remove('is-clicking');
  });

  // ── Fade out / in at the document boundary ───────────────────────
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('cursor-visible');
    glow.classList.remove('cursor-visible');
  });
  document.addEventListener('mouseenter', () => {
    if (seenFirstMove) {
      dot.classList.add('cursor-visible');
      glow.classList.add('cursor-visible');
    }
  });

  // ── Animation loop — magnetic pull + trailing glow ───────────────
  function tick() {
    let targetX   = mouseX;
    let targetY   = mouseY;
    let nearGlass = false;

    glassEls.forEach((card) => {
      const r    = card.getBoundingClientRect();
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      const dist = Math.hypot(mouseX - cx, mouseY - cy);

      if (dist < MAGNETIC_RADIUS) {
        // Quadratic pull: gentle at the boundary, deliberate at centre.
        // The closer the moth, the stronger the light draws it.
        const pull = Math.pow(1 - dist / MAGNETIC_RADIUS, 2) * MAGNETIC_STRENGTH;
        targetX   += (cx - mouseX) * pull;
        targetY   += (cy - mouseY) * pull;
        nearGlass  = true;
      }
    });

    // Dot follows the magnetic target unhurried — a vessel correcting
    // course, never snapping to it
    dotX = lerp(dotX, targetX, 0.22);
    dotY = lerp(dotY, targetY, 0.22);

    // Glow drifts behind the dot — slower, heavier, like light spilled on water
    glowX = lerp(glowX, dotX, 0.06);
    glowY = lerp(glowY, dotY, 0.06);

    dot.style.left  = dotX  + 'px';
    dot.style.top   = dotY  + 'px';
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';

    dot.classList.toggle('is-near-glass',  nearGlass);
    glow.classList.toggle('is-near-glass', nearGlass);

    requestAnimationFrame(tick);
  }
  tick();
}());

// ─── Typewriter headline ─────────────────────────────────────────
// Each role arrives letter by letter. A long pause — a held note,
// a breath — before the slow erasure. Then silence, then the next.
(function () {
  const textEl   = document.getElementById('typedText');
  const cursorEl = document.getElementById('typedCursor');
  if (!textEl || !cursorEl) return;

  // Reduced motion: show the first role statically, hide the cursor
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    textEl.textContent = 'a design engineer.';
    cursorEl.style.display = 'none';
    return;
  }

  // Five roles — each one a true, slightly different answer
  // (let so the language switcher can replace this array mid-cycle)
  let roles = [
    'a design engineer.',
    'a frontend sculptor.',
    'a builder of careful things.',
    'a visual architect.',
    'a pixel poet.',
  ];

  // Language switcher calls this; the new roles take effect on the next erase cycle
  window.__setTypewriterLang = function (newRoles) { roles = newRoles; };

  const TYPE_MIN    =  55;  // ms — minimum time between typed characters
  const TYPE_MAX    =  95;  // ms — maximum time (randomness = humanity)
  const ERASE_MIN   =  35;  // ms — erasing is quicker, more mechanical
  const ERASE_MAX   =  60;  // ms
  const PAUSE_FULL  = 2800; // ms — the long breath after a complete word
  const PAUSE_EMPTY =  420; // ms — the shorter breath before the next begins

  const rand = (lo, hi) => lo + Math.random() * (hi - lo);

  let role      = 0;
  let charIndex = 0;
  let erasing   = false;

  function tick() {
    const current = roles[role];

    if (!erasing) {
      // ── Typing: one character arrives ──────────────────────────
      cursorEl.classList.add('is-typing'); // cursor holds still — full attention
      charIndex++;
      textEl.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        // The full word is here — hold, let it be seen, then let it go
        cursorEl.classList.remove('is-typing');
        erasing = true;
        setTimeout(tick, PAUSE_FULL);
        return;
      }
      setTimeout(tick, rand(TYPE_MIN, TYPE_MAX));

    } else {
      // ── Erasing: one character departs ─────────────────────────
      cursorEl.classList.add('is-typing'); // cursor holds still while erasing
      charIndex--;
      textEl.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        // The word is gone — silence, then the next one will come
        cursorEl.classList.remove('is-typing');
        erasing = false;
        role    = (role + 1) % roles.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      setTimeout(tick, rand(ERASE_MIN, ERASE_MAX));
    }
  }

  // Begin after the hero reveal settles (≈700ms transition) + a short breath
  setTimeout(tick, 1200);
}());

// ─── Project detail modals ──────────────────────────────────────
// Click a card and the world behind it softens, recedes.
// The glass panel rises through the blurred haze — the rest of
// the page held at a respectful, impressionistic distance.
(function () {
  const backdrop   = document.getElementById('modalBackdrop');
  const closeBtn   = document.getElementById('modalClose');
  const modalHero  = document.getElementById('modalHero');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  const modalDetail = document.getElementById('modalDetail');
  const modalTagRow = document.getElementById('modalTagRow');
  const modalCta   = document.getElementById('modalCta');

  if (!backdrop) return;

  let lastFocused = null;

  function open(card) {
    // Read content from the card's existing DOM — no duplication
    const emoji  = card.querySelector('.project-image').textContent.trim();
    const title  = card.querySelector('h3').textContent.trim();
    const desc   = card.querySelector('p').textContent.trim();
    const detail = card.dataset.detail || '';
    const tags   = Array.from(card.querySelectorAll('.tag')).map((t) => t.textContent.trim());
    const href   = card.querySelector('.project-link')?.getAttribute('href') || '#';

    // Populate the glass panel
    modalHero.textContent  = emoji;
    modalTitle.textContent = title;
    modalDesc.textContent  = desc;
    modalDetail.textContent = detail;
    modalDetail.style.display = detail ? '' : 'none';

    modalTagRow.innerHTML = '';
    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      modalTagRow.appendChild(span);
    });

    modalCta.href = href;

    // Prevent scrollbar-shift jank
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarW + 'px';
    document.body.style.overflow     = 'hidden';

    // Open — the world blurs in
    lastFocused = document.activeElement;
    backdrop.removeAttribute('aria-hidden');
    backdrop.classList.add('is-open');

    setTimeout(() => closeBtn.focus(), 50);
  }

  function close() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow     = '';
    document.body.style.paddingRight = '';
    if (lastFocused) lastFocused.focus();

    // Restore aria-hidden only after the fade-out completes
    backdrop.addEventListener(
      'transitionend',
      () => backdrop.setAttribute('aria-hidden', 'true'),
      { once: true }
    );
  }

  // Wire every project card — click or Enter/Space to open
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card);
      }
    });
  });

  closeBtn.addEventListener('click', close);

  // Click the dark backdrop area (outside the panel) to close
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Escape to close — the world reassembles gently behind you
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });
}());

// ─── Nav scroll effect ─────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Staggered section transitions ──────────────────────────────
// Sections do not arrive. They assemble — each child drifting into
// place in turn, like objects being set down with deliberate care.
// The 80ms gap between each element is the space between thoughts:
// long enough to feel, short enough that the whole still coheres.
(function () {
  // If GSAP didn't load from CDN, reveal everything immediately
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Reduced motion: show all at once without animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.reveal', { opacity: 1, y: 0, clearProps: 'all' });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero — above the fold, animates on page load ─────────────────
  // The text is ready when the typewriter begins. The card settles
  // just after, carrying the weight of the introduction.
  const heroItems = Array.from(document.querySelectorAll('#hero .reveal'));
  if (heroItems.length) {
    gsap.set(heroItems, { opacity: 0, y: 24 });
    gsap.to(heroItems, {
      opacity:    1,
      y:          0,
      duration:   0.90,
      ease:       'power2.out',
      stagger:    0.18,
      delay:      0.22,
      clearProps: 'transform',
    });
  }

  // ── All sections below the fold — drift in on scroll ─────────────
  // Each section assembles its children one by one. Not all at once —
  // that would be noise. One. Then the next. Then the next. A cadence.
  document.querySelectorAll('section:not(#hero)').forEach((section) => {
    const items = Array.from(section.querySelectorAll('.reveal'));
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 28 });

    ScrollTrigger.create({
      trigger: section,
      start:   'top 84%',
      once:    true,
      onEnter() {
        gsap.to(items, {
          opacity:    1,
          y:          0,
          duration:   0.85,                  // the time of one slow breath
          ease:       'power3.out',          // settles into place, not bounces
          stagger:    0.08,                  // 80ms — the specified cadence
          clearProps: 'transform',           // release to card-tilt after reveal
        });
      },
    });
  });
}());

// ─── Ambient particle field ─────────────────────────────────────
// Stars do not hurry. They drift at a speed the eye cannot quite
// follow, trailing faint lines between near-neighbours — connections
// that form and dissolve like thoughts not quite held. Behind the
// orbs. Behind the glass. The thing you see when you stop looking.
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Motion-sensitive users see nothing — the stillness is its own answer
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx   = canvas.getContext('2d');
  const htmlEl = document.documentElement;

  // ── Constants ─────────────────────────────────────────────────────
  const COUNT    = 55;    // sparse — the negative space carries the weight
  const MAX_SPD  = 0.28;  // px/frame — slower than a minute hand
  const JITTER   = 0.008; // random-walk delta — keeps drift organic
  const LINK_R   = 140;   // px — constellation connection threshold
  const LINE_OPA = 0.13;  // max line opacity — a whisper, not a voice

  // ── Per-theme accent colours ──────────────────────────────────────
  // Dark: #c8c8c8 silver-gray   Light: #505050 charcoal-gray
  const DARK_COL  = { r: 190, g: 190, b: 190 };
  const LIGHT_COL = { r:  80, g:  80, b:  80 };

  const lerp = (a, b, t) => a + (b - a) * t;

  // Colour lerps from current toward target on every frame —
  // theme transitions play out over ~2s after the CSS switch.
  let col    = Object.assign({}, htmlEl.dataset.theme === 'light' ? LIGHT_COL : DARK_COL);
  let target = Object.assign({}, col);

  // ── Canvas sizing — DPR-aware ──────────────────────────────────────
  let W, H, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W   = window.innerWidth;
    H   = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset + apply DPR — no accumulated drift
  }

  // ── Spawn one particle at (x, y) ──────────────────────────────────
  function make(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const spd   = 0.05 + Math.random() * MAX_SPD;
    return {
      x, y,
      vx:    Math.cos(angle) * spd,
      vy:    Math.sin(angle) * spd,
      r:     0.7  + Math.random() * 1.7,    // 0.7 – 2.4 px  — motes to small lights
      alpha: 0.22 + Math.random() * 0.44,   // 0.22 – 0.66  — none fully visible
      phase: Math.random() * Math.PI * 2,   // breath phase — unique per particle
      bpm:   0.005 + Math.random() * 0.009, // breathing speed — no two pulse alike
      px:    0,                              // pulsed alpha, computed each frame
    };
  }

  // ── Initialise ────────────────────────────────────────────────────
  let particles;

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () =>
      make(Math.random() * W, Math.random() * H)
    );
    // Emerge slowly — no sudden arrival, no announcement
    setTimeout(() => canvas.classList.add('is-ready'), 200);
  }

  // ── Animation loop ────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Colour lerp toward theme target — smooth, unhurried shift
    col.r = lerp(col.r, target.r, 0.03);
    col.g = lerp(col.g, target.g, 0.03);
    col.b = lerp(col.b, target.b, 0.03);
    const cr = col.r | 0;
    const cg = col.g | 0;
    const cb = col.b | 0;

    // ── Update — positions, random walk, wrapping, breath ───────────
    particles.forEach((p) => {
      p.vx += (Math.random() - 0.5) * JITTER;
      p.vy += (Math.random() - 0.5) * JITTER;
      const s = Math.hypot(p.vx, p.vy);
      if (s > MAX_SPD) { p.vx = p.vx / s * MAX_SPD; p.vy = p.vy / s * MAX_SPD; }

      p.x += p.vx;
      p.y += p.vy;

      // Seamless edge wrap — particles reappear on the opposite side
      if (p.x < -24) p.x = W + 24;
      if (p.x > W + 24) p.x = -24;
      if (p.y < -24) p.y = H + 24;
      if (p.y > H + 24) p.y = -24;

      // Breathed opacity — stored so line drawing can share the value
      p.px = p.alpha * (0.50 + 0.50 * Math.sin(p.phase));
      p.phase += p.bpm;
    });

    // ── Constellation lines — behind particles, first in paint order ─
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[j].x - particles[i].x;
        const dy   = particles[j].y - particles[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist >= LINK_R) continue;

        const a = (1 - dist / LINK_R) * LINE_OPA;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    // ── Particles — on top of lines, breathing independently ────────
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.px.toFixed(3)})`;
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  // ── Wire up ───────────────────────────────────────────────────────
  init();
  tick();

  window.addEventListener('resize', resize);

  // When the theme toggles, point the colour lerp at its new target.
  // The canvas drifts into its new palette over ~2 seconds — longer
  // than the CSS transition, so the stars are the last thing to change.
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      requestAnimationFrame(() => {
        target = Object.assign({}, htmlEl.dataset.theme === 'light' ? LIGHT_COL : DARK_COL);
      });
    });
  }
}());

// ─── Writing / Blog section ─────────────────────────────────────
// Three glass cards, each a sealed letter. The first sentence is
// visible. The rest waits behind the glass, patient. Click: the
// world softens, the post opens. Read. Close. The world returns.
(function () {
  const grid      = document.getElementById('postsGrid');
  const backdrop  = document.getElementById('postBackdrop');
  const closeBtn  = document.getElementById('postClose');
  const postMeta  = document.getElementById('postMeta');
  const postTitle = document.getElementById('postTitle');
  const postBody  = document.getElementById('postBody');

  if (!grid || !backdrop || typeof POSTS === 'undefined') return;

  // ── Render post cards from the POSTS data array ──────────────────
  POSTS.forEach((post) => {
    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const card = document.createElement('div');
    card.className = 'glass post-card reveal';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.innerHTML = `
      <div class="post-card-date">${dateStr} &middot; ${post.readTime}</div>
      <h3 class="post-card-title">${post.title}</h3>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <span class="post-card-cta" aria-hidden="true" data-i18n="writing.read">Read &rarr;</span>
    `;

    card.addEventListener('click', () => open(post));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(post); }
    });

    grid.appendChild(card);
  });

  // Register rendered cards with GSAP scroll reveal (they come in
  // after the main stagger IIFE has already run, so get their own trigger)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const cards = Array.from(grid.querySelectorAll('.post-card'));
    gsap.set(cards, { opacity: 0, y: 28 });
    ScrollTrigger.create({
      trigger: '#writing',
      start:   'top 84%',
      once:    true,
      onEnter() {
        gsap.to(cards, {
          opacity:    1,
          y:          0,
          duration:   0.85,
          ease:       'power3.out',
          stagger:    0.08,
          delay:      0.08, // let the section header lead by one step
          clearProps: 'transform',
        });
      },
    });
  } else {
    // GSAP unavailable — show cards immediately
    grid.querySelectorAll('.post-card').forEach((c) => {
      c.style.opacity   = '1';
      c.style.transform = 'none';
    });
  }

  // ── Post reader — open ───────────────────────────────────────────
  let lastFocused = null;

  function open(post) {
    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    postMeta.textContent  = `${dateStr} · ${post.readTime} read`;
    postTitle.textContent = post.title;

    // Render Markdown — marked.js produces clean, semantic HTML
    if (typeof marked !== 'undefined') {
      postBody.innerHTML = marked.parse(post.content.trim());
    } else {
      // Fallback: plain paragraphs split on double newline
      postBody.innerHTML = post.content.trim()
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, ' ').trim()}</p>`)
        .join('');
    }

    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sw + 'px';
    document.body.style.overflow     = 'hidden';

    lastFocused = document.activeElement;
    backdrop.removeAttribute('aria-hidden');
    backdrop.classList.add('is-open');
    // Scroll the reader back to top for each new post
    backdrop.querySelector('.modal-scroll').scrollTop = 0;
    setTimeout(() => closeBtn.focus(), 50);
  }

  // ── Post reader — close ──────────────────────────────────────────
  function close() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow     = '';
    document.body.style.paddingRight = '';
    if (lastFocused) lastFocused.focus();
    backdrop.addEventListener(
      'transitionend',
      () => backdrop.setAttribute('aria-hidden', 'true'),
      { once: true }
    );
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });
}());

// ─── Skill bars ─────────────────────────────────────────────────
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) skillObserver.observe(skillsSection);

// ─── Tilt on glass cards (a held angle, not a flinch) ───────────
// The lean is small — the kind a careful hand gives an object,
// not the snap of a hinge. Large panels are excluded: a surface
// that size reads as architecture, not something held.
const TILT_MAX = 3.5; // deg — barely perceptible, deliberate
document.querySelectorAll('.glass').forEach((card) => {
  if (card.matches('.skills-section, .contact-card')) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * TILT_MAX;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -TILT_MAX;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-3px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s ease';
  });
});

// ─── Contact form ───────────────────────────────────────────────
// The message leaves the page. The world waits. Then: confirmation,
// or silence. Each outcome has its own colour and its own patience.
(function () {
  const form     = document.querySelector('.contact-form');
  const statusEl = document.getElementById('formStatus');
  if (!form || !statusEl) return;

  function showStatus(type, html) {
    statusEl.innerHTML = html;
    statusEl.className = `form-status status-${type} is-visible`;
  }

  function hideStatus() {
    statusEl.classList.remove('is-visible');
    // Wait for the fade-out before clearing text
    setTimeout(() => { statusEl.innerHTML = ''; statusEl.className = 'form-status'; }, 450);
  }

  function lockForm(btn) {
    btn.disabled = true;
    form.classList.add('is-submitting');
  }

  function unlockForm(btn, label, stateClass) {
    btn.textContent = label;
    btn.classList.remove('is-sending');
    btn.classList.add(stateClass);
    btn.disabled = true; // stays disabled until auto-reset
    form.classList.remove('is-submitting');
  }

  function reset(btn, stateClass) {
    const dict = (window.__currentLang && typeof LANG !== 'undefined' && LANG[window.__currentLang])
      ? LANG[window.__currentLang] : null;
    btn.textContent = dict ? dict.contact.submit : 'Send message';
    btn.classList.remove(stateClass);
    btn.disabled = false;
    hideStatus();
    form.reset();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    hideStatus();

    // ── Demo mode — endpoint not yet configured ──────────────────
    if (!FORM_ENDPOINT) {
      lockForm(btn);
      unlockForm(btn, 'Message sent ✓', 'is-sent');
      showStatus('success', 'Running in demo mode— no message was sent. Add a Formspree endpoint to go live.');
      setTimeout(() => reset(btn, 'is-sent'), 3800);
      return;
    }

    // ── Sending state — the message is in transit ────────────────
    btn.textContent = 'Sending…';
    btn.classList.add('is-sending');
    lockForm(btn);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method:  'POST',
        body:     new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      // ── Success — the message arrived ──────────────────────────
      unlockForm(btn, 'Message received ✓', 'is-sent');
      showStatus('success', 'Your message is on its way. I tend to reply within a day or two.');
      setTimeout(() => reset(btn, 'is-sent'), 5000);

    } catch (_err) {
      // ── Error — something stood between the message and its end ─
      unlockForm(btn, 'Something went wrong', 'is-error');
      showStatus(
        'error',
        'The message didn’t go through. Write directly to ' +
        '<a href="mailto:hello@cristiansifuentes.dev">hello@cristiansifuentes.dev</a>'
      );
      setTimeout(() => reset(btn, 'is-error'), 6000);
    }
  });
}());

// ─── Image optimisation — lazy reveal ───────────────────────────
// The emoji holds the frame until the photograph arrives.
// When the browser delivers the image, it does not snap into place —
// it surfaces slowly, opacity rising over 650ms, like a print
// emerging in developer. The emoji yields in parallel, unhurried.
(function () {
  const imgs = Array.from(document.querySelectorAll('.img-reveal'));
  if (!imgs.length) return;

  function reveal(img) {
    img.classList.add('is-loaded');
    const thumb = img.closest('.project-thumb');
    if (thumb) thumb.classList.add('has-image');
  }

  imgs.forEach(function (img) {
    // Images already in the cache may be complete before this script runs
    if (img.complete) {
      if (img.naturalWidth > 0) reveal(img); // cached and loaded
      // naturalWidth === 0 means the fetch failed — emoji fallback stays
      return;
    }
    img.addEventListener('load',  function () { reveal(img); }, { once: true });
    // No error handler needed: on 404 the fallback emoji is already visible
  });
}());

// ─── Multilingual support ────────────────────────────────────────
// Two tongues. One self. The button shows the language you have
// not yet chosen — pressing it is the act of crossing over.
// Text fades, the world shifts, the portfolio speaks again.
(function () {
  if (typeof LANG === 'undefined') return;

  const toggle = document.getElementById('langToggle');
  const label  = document.getElementById('langLabel');
  const htmlEl = document.documentElement;

  // Resolve a dot-path key inside a language object
  // e.g. resolve(LANG.es, 'about.c1.title') → 'Diseño primero'
  function resolve(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  // Detect the preferred language on first load
  function detect() {
    const saved = localStorage.getItem('lang');
    if (saved && LANG[saved]) return saved;
    const browser = ((navigator.language || navigator.userLanguage || 'en').slice(0, 2)).toLowerCase();
    return LANG[browser] ? browser : 'en';
  }

  // Write translations into every data-i18n / data-i18n-placeholder element
  function swap(code) {
    const dict = LANG[code];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const text = resolve(dict, el.dataset.i18n);
      if (text !== null) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const text = resolve(dict, el.dataset.i18nPlaceholder);
      if (text !== null) el.placeholder = text;
    });

    // Update the html[lang] attribute for accessibility and SEO
    htmlEl.lang = code;

    // Hand new roles to the typewriter — it picks them up on the next cycle
    if (typeof window.__setTypewriterLang === 'function') {
      window.__setTypewriterLang(dict.hero.roles);
    }

    // Toggle label shows the OTHER language (the one you can become)
    const other = code === 'en' ? 'ES' : 'EN';
    if (label) label.textContent = other;
    if (toggle) {
      toggle.setAttribute('aria-label', other === 'ES' ? 'Cambiar a español' : 'Switch to English');
    }

    // Expose current language for other modules (form reset, etc.)
    window.__currentLang = code;
    localStorage.setItem('lang', code);
  }

  // Animated switch: translatable text dims, swaps, then returns
  function applyLang(code, animate) {
    if (!animate) {
      swap(code);
      return;
    }

    const targets = Array.from(document.querySelectorAll('[data-i18n]'));

    // Fade out — a held breath
    targets.forEach(function (el) {
      el.style.transition = 'opacity 0.16s ease';
      el.style.opacity    = '0';
    });

    setTimeout(function () {
      swap(code);

      // Fade in — the new voice arrives
      targets.forEach(function (el) { el.style.opacity = '1'; });

      // Release inline styles; do not permanently alter each element's transitions
      setTimeout(function () {
        targets.forEach(function (el) {
          el.style.transition = '';
          el.style.opacity    = '';
        });
      }, 220);
    }, 160);
  }

  // ── Init ──────────────────────────────────────────────────────────
  applyLang(detect(), false);

  // ── Toggle ───────────────────────────────────────────────────────
  if (toggle) {
    toggle.addEventListener('click', function () {
      applyLang(window.__currentLang === 'en' ? 'es' : 'en', true);
    });
  }
}());
