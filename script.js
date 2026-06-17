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
  const MAGNETIC_STRENGTH = 0.32;  // 0–1 — fraction of pull at the very centre
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

    // Dot follows the magnetic target with light lag — feels tethered, alive
    dotX = lerp(dotX, targetX, 0.50);
    dotY = lerp(dotY, targetY, 0.50);

    // Glow drifts behind the dot — slower, heavier, like light spilled on water
    glowX = lerp(glowX, dotX, 0.07);
    glowY = lerp(glowY, dotY, 0.07);

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
  const roles = [
    'a design engineer.',
    'a frontend sculptor.',
    'a builder of careful things.',
    'a visual architect.',
    'a pixel poet.',
  ];

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

// ─── Tilt on glass cards (subtle mouse tracking) ───────────────
document.querySelectorAll('.glass').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

// ─── Contact form ───────────────────────────────────────────────
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Message sent ✓';
    btn.style.background = 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.3))';
    btn.style.borderColor = 'rgba(52, 211, 153, 0.5)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send message';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}
