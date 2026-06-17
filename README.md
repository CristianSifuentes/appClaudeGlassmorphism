# Glassmorphism Portfolio
### *A surface made of frozen light.*

A single-page personal portfolio built with HTML, CSS, and vanilla JavaScript. No framework, no build step. One CDN dependency — GSAP for staggered scroll transitions, loaded as a plain `<script>` tag with a graceful inline fallback if it fails. Open `index.html` and it breathes.

The design speaks two languages: a **cold monochrome night** for those who work in silence, and a **warm fog** for those who feel the weight of afternoon light. Between them, a crossfade — a held breath — not a snap.

![Glassmorphism Portfolio](https://img.shields.io/badge/Design-Glassmorphism-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## The Two Palettes

### Dark — *Cold Depth*
The colour of a city at 3 a.m. Cool blues and near-black charcoals. The glass catches light that has nowhere else to go.

| Token | Value | Feeling |
|---|---|---|
| Background gradient | `#0a0a0a → #1a1a2e → #16213e` | Deep night, receding |
| Glass fill | `rgba(255,255,255, 0.05)` | Almost nothing. A rumour of surface |
| Accent | `#7c9cff` | Cold periwinkle, distant |
| Primary text | `#f0f0f0` | Warm against the cold |

### Light — *Warm Fog*
The quiet after a long rain. Old parchment. Pages of a book left open on a windowsill. The feeling of aged objects. Think Morandi. Think Hopper's afternoon.

| Token | Value | Feeling |
|---|---|---|
| Background gradient | `#ede8df → #e5ddd0 → #dbd3c5` | Warm parchment, receding gently |
| Glass fill | `rgba(255,251,244, 0.52)` | Old church window, amber-warm |
| Accent | `#5d7a9e` | Dusty slate periwinkle, contemplative |
| Primary text | `#221e17` | Warm charcoal ink |

---

## The Glass Formula

Every card, every panel, every surface is built on a single `.glass` utility. The rest is variation.

```css
.glass {
  background:       rgba(255, 255, 255, 0.05);        /* translucency */
  backdrop-filter:  blur(20px);                        /* the frost    */
  border:           1px solid rgba(255,255,255, 0.12); /* the edge     */
  border-radius:    24px;
  box-shadow:       0 8px 32px 0 rgba(0,0,0, 0.45);
}
```

In light mode the glass warms: higher opacity, amber tint, sepia shadow. The same component, a different light.

---

## Features

| | Feature | Description |
|---|---|---|
| ✓ | **Dark / Light theme toggle** | Glass pill toggle with spring-physics thumb. System preference detected on first load, `localStorage` for persistence. Crossfading dual-layer gradient background. Orbs shift from cool cobalt to warm amber dust. |
| ✓ | **Magnetic cursor** | Custom dot + trailing glow. Quadratic gravitational pull toward glass cards. `mix-blend-mode: screen` in dark mode; normalises in light. Silent on touch devices. |
| ✓ | **Typed headline** | Hero h1 cycles through five roles. Recursive `setTimeout`, variable character timing, 2800ms held pause per word. 2px blinking cursor. `prefers-reduced-motion` safe. |
| ✓ | **Project detail modals** | Click a card; the world blurs into a glass overlay. Backdrop `backdrop-filter` transitions from `blur(0)` to `blur(20px)`. Panel enters at `scale(0.94)` and rises. Escape / outside-click closes. Focus trapped, scroll locked. |
| ✓ | **Staggered section transitions** | GSAP + ScrollTrigger. Hero fades in on load. Every section below the fold staggers its children at 80ms intervals, `power3.out`. `clearProps: 'transform'` hands control back to card-tilt. CDN-fail and `prefers-reduced-motion` safe. |
| ✓ | **Real contact backend** | Formspree integration. One `const FORM_ENDPOINT` at the top of `script.js`. Three states: `is-sending` (pulse animation), `is-sent` (green), `is-error` (rose + fallback email link). Status line fades up via `aria-live`. Demo mode when endpoint is empty. |
| ✓ | **Glassmorphism card system** | `.glass` utility — backdrop blur, translucent fill, luminous border, soft shadow |
| ✓ | **Floating hero card** | Sine-wave float animation with subtle 3-axis mouse tilt |
| ✓ | **Scroll reveal** | `IntersectionObserver` — elements rise as they enter the viewport |
| ✓ | **Animated skill bars** | Fill on scroll entry via `data-width`; eased cubic-bezier fill |
| ✓ | **Responsive layout** | CSS Grid, `clamp()` fluid type, graceful mobile collapse |
| ✓ | **Contact form feedback** | Submit state with colour confirmation and auto-reset |

---

## Typed Headline — How It Works

The hero `h1` is split into two parts: a static portion — the name and em-dash — and a typed portion that cycles through five roles. No library. A single recursive `setTimeout` and two state variables: current character index, and whether we are typing or erasing.

**The timing is the emotion.** A 2800ms pause sits after every complete word — nearly three seconds of stillness. This is not a delay. It is a breath. The role appears, the page waits *with you*, and only then lets it go. The erasure takes roughly one second, unhurried. Then a 420ms silence before the next word begins. The rhythm: *arrive — rest — depart — breathe — arrive again.*

**Human imperfection.** Each character is typed after a random delay between 55ms and 95ms. The range is small but decisive — it separates a machine from a person. Erasing runs faster (35–60ms) and with a narrower band: erasing is mechanical, typing is considered.

**The cursor.** A 2px hairline — not a `_`, not a blinking block. It holds solid during typing (`animation-play-state: paused`) — full attention, no distraction. During the long pause it blinks at 1.06s with `ease-in-out` — present, then absent, like a thought that hasn't finished forming. The blink period is slightly longer than the standard 1s: slower, more meditative.

**The five roles** are chosen for texture, not just meaning:

| Role | Quality |
|---|---|
| `a design engineer.` | Grounded, the professional truth |
| `a frontend sculptor.` | Material, physical — implies craft and form |
| `a builder of careful things.` | Melancholic restraint — *careful*, not grand |
| `a visual architect.` | Structural, considered |
| `a pixel poet.` | Short, almost a confession |

**Accessibility.** `prefers-reduced-motion: reduce` displays the first role statically and hides the cursor entirely. No animation, no distraction — the content is the same.

```js
// The pause IS the emotion — 2800ms of stillness between each self
setTimeout(tick, PAUSE_FULL);

// Randomness humanises — no two characters arrive at the same speed
setTimeout(tick, 55 + Math.random() * 40);
```

---

## Magnetic Cursor — How It Works

The cursor is two elements: a small, precise `.cursor-dot` that the eye follows, and a larger `.cursor-glow` that drifts behind it — slower, heavier, like light spilled on water. Neither moves with `transform` in the animation loop; `left`/`top` are set each frame so `transform: translate(-50%, -50%)` can stay as a static centering rule, untouched.

**The moth effect:** each glass card defines a field of attraction. At 140px radius, the pull is zero. At the centre, it reaches 32% of the remaining distance. The falloff is quadratic — `(1 - dist/R)²` — so the approach feels gravitational rather than mechanical. The closer the cursor, the stronger the pull. The moth drawn to the light.

**The trail:** the dot lerps toward the magnetic target at `t = 0.50` per frame — quick but not instant, like a finger dragged through water. The glow lerps toward the dot at `t = 0.07` — much slower, half a second of drift before it settles. The separation between them is the whole feeling: precision leading, warmth following.

**Blend mode:** in dark mode, `mix-blend-mode: screen` on the dot lets it pass through surfaces without a hard edge — it glows rather than sits. On a light background, screen blends to near-invisible, so `[data-theme="light"]` switches it to `normal`.

**Touch safety:** the entire system is wrapped in a media query check — `(hover: hover) and (pointer: fine)` — so it never activates on phones or tablets. No orphaned invisible `cursor: none` on touch devices.

```js
// Quadratic pull — the closer, the stronger
const pull = Math.pow(1 - dist / MAGNETIC_RADIUS, 2) * MAGNETIC_STRENGTH;
targetX   += (cx - mouseX) * pull;
targetY   += (cy - mouseY) * pull;

// Dot follows: quick, tethered
dotX = lerp(dotX, targetX, 0.50);

// Glow follows the dot: slow, like spilled light
glowX = lerp(glowX, dotX, 0.07);
```

---

## Theme Toggle — How It Works

The toggle is a 54×29px glass pill with a 23px thumb that slides between positions. Two details make it feel crafted rather than functional:

**The spring:** the thumb uses `cubic-bezier(0.34, 1.56, 0.64, 1)` — a slight overshoot that makes it feel physical, like a mechanical switch finding its seat.

**The crossfade:** CSS cannot interpolate between gradient values, so a simple `transition: background` does nothing. The real solution is two stacked fixed `<div>` layers — `.page-bg--dark` and `.page-bg--light` — that crossfade via `opacity`. The entire background dissolves from one world to the other.

**The transition clash:** applying a blanket `transition` to `*` permanently breaks hover timings, reveal animations, and skill bar fills. Instead, a `.theme-transitioning` class is added to `<html>` for exactly 700ms on each switch, overriding transition properties only in that window.

**The orbs:** instead of gradient backgrounds (which cannot animate), each orb uses a solid `background-color` from a CSS variable. `background-color` is animatable — so the orbs shift from cool cobalt to warm amber dust during the switch.

```js
themeToggle.addEventListener('click', () => {
  html.classList.add('theme-transitioning');          // unlock transitions
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('theme', next);
  setTimeout(() => html.classList.remove('theme-transitioning'), 700);
});
```

---

## Real Contact Backend — How It Works

A form that sends nothing is a closed door wearing the face of an open one. This feature wires the glass contact card to **Formspree** — a stateless email-relay service — through a single configuration string at the very top of `script.js`. No server, no build step, no environment file. One URL and the form becomes real.

**The one variable.** The very first line of `script.js`, above everything:

```js
const FORM_ENDPOINT = ''; // ← e.g. 'https://formspree.io/f/xabcdefg'
```

When empty, the form operates in **demo mode**: it completes the full visual journey — sending, confirmed, reset — but dispatches nothing. When the endpoint is pasted in, the form goes live. Changing one string is the entire deployment.

**Setting it up.** Sign up at [formspree.io](https://formspree.io), create a new form (free tier: 50 submissions/month), and copy the endpoint URL. Paste it into `FORM_ENDPOINT`. That's the full integration. Formspree handles routing, spam filtering, and email delivery. Each `name` attribute on the form's inputs — `name`, `email`, `subject`, `message` — becomes a labeled field in the received email.

**The async journey.** Submission is a `fetch()` POST with `new FormData(form)`, which reads every named field without manual extraction. The `Accept: application/json` header instructs Formspree to return JSON instead of redirecting, preserving the SPA experience. The handler is `async/await`: linear and readable, structured like a sentence with a beginning, a middle, and two possible endings.

**Three moments of the button.**

- **`is-sending`** — the message is in transit. The button dims to 65% opacity and pulses gently: a `@keyframes` animation at 1.5s `ease-in-out`, breathing between 38% and 65% opacity. The form receives `is-submitting` which removes `pointer-events` from all inputs — the form cannot be resubmitted mid-flight.
- **`is-sent`** — the message arrived. The button shifts to a translucent green: `rgba(52, 211, 153, 0.20)` background, matching border. Below it, a status line rises into view — *"Your message is on its way. I tend to reply within a day or two."* — then the form resets quietly after 5 seconds.
- **`is-error`** — something stood between the message and its destination. The button turns rose-pale: `rgba(251, 113, 133, 0.16)`. The status line offers a direct email address as an alternative route. After 6 seconds, the button resets so the user may try again.

**The status line.** A single `<div>` below the submit button, invisible by default (`opacity: 0; transform: translateY(-5px)`). On state change, two CSS transitions play simultaneously: opacity rises and the element lifts 5px — the same upward-drift grammar as the scroll reveal. It carries `role="status"` and `aria-live="polite"` so screen readers announce the outcome without interrupting the user mid-action. On reset, the class is removed first (fade begins), then the text is cleared 450ms later after the transition completes.

**In light mode**, the status colours deepen: the same semantic green and rose, but saturated enough to read against warm parchment (`rgba(10, 130, 70, 0.90)` and `rgba(200, 45, 60, 0.90)`). Both are set as CSS custom properties in `[data-theme="light"]`.

```js
// One variable. Everything else is handled.
const FORM_ENDPOINT = 'https://formspree.io/f/xabcdefg';

// The full journey — transit, arrival or failure — in one try/catch
const res = await fetch(FORM_ENDPOINT, {
  method:  'POST',
  body:     new FormData(form),   // reads all named fields
  headers: { 'Accept': 'application/json' },
});
```

---

## Staggered Section Transitions — How It Works

Sections do not appear. They *assemble* — each child drifting into place in sequence, as though objects are being set down with deliberate, unhurried care. The 80ms gap between each element is not a delay. It is the space between thoughts: long enough to feel, short enough that the whole still coheres.

**Why GSAP.** CSS transitions — the approach that preceded this — apply to all elements simultaneously. The section enters and every child fades in at once: a crowd arriving through a door, not a procession. GSAP timelines with `stagger` give each element its own moment. The header arrives first. Then the first card. Then the next. The sequence carries meaning that simultaneity cannot.

**The hero.** Above-the-fold elements (`#hero .reveal`) animate on page load, not on scroll. A 220ms page-load delay lets the browser settle before the entrance begins. The hero text fades up at `delay: 0.22s`; the glass profile card follows 180ms later — just as the typewriter begins its first letter at 1200ms. The timing is not planned to the millisecond; it is felt by iteration.

**The below-fold sections.** Each section (`#about`, `#work`, `#contact`) becomes a ScrollTrigger. When its top reaches 84% of the viewport height — early enough to feel responsive, late enough that the user has clearly intended to read it — GSAP animates all `.reveal` children in sequence. Duration: 0.85s per element. Ease: `power3.out` — a cubic deceleration that spends most of its time settling rather than lifting. The element is moving slowly before you notice it moved.

**`clearProps: 'transform'`** is the detail that makes the rest of the page work. GSAP owns `transform` during the entrance animation (`y: 28 → 0`). After completion, `clearProps` removes the inline `transform` style entirely — returning the property to the CSS layer where the card-tilt effect and the hero's float animation live. Without this one word, the tilt would fight GSAP's inline style and lose.

**Graceful degradation.** If the GSAP CDN fails (network error, offline use), a synchronous fallback immediately reveals all `.reveal` elements inline — no user ever sees a blank portfolio. `prefers-reduced-motion: reduce` is handled at two levels: the CSS rule makes elements visible at the cascade level, and the GSAP IIFE checks the same media query and calls `gsap.set('.reveal', { clearProps: 'all' })` to remove any inline state GSAP may have already set.

```js
// The cadence: not simultaneity, but sequence
gsap.to(items, {
  opacity:    1,
  y:          0,
  duration:   0.85,      // the time of one slow breath
  ease:       'power3.out',
  stagger:    0.08,      // 80ms — the space between thoughts
  clearProps: 'transform',
});

// The handoff: GSAP releases the transform, card-tilt takes over
// Without clearProps, tilt fights the inline style and loses.
```

---

## Project Detail Modals — How It Works

Click a card and the rest of the world does not go dark — it *blurs*. This distinction matters. Black is an ending. Blur is a deepening. The page is still there, still breathing, just held softly out of focus while you attend to this one thing. When you close the modal, the world reassembles, gently, behind you.

**The world softening.** The modal backdrop is a full-viewport fixed layer with a CSS `backdrop-filter`. At rest it is `blur(0px)`, invisible. When the modal opens, it transitions to `blur(20px)` over 440ms — not a snap, a gradual recession. The orbs, the cards, the text: all dissolve to impressionism while you read. The closing animation reverses this: the world returns.

**The panel rising.** The glass panel enters at `scale(0.94) translateY(28px)` — slightly small, slightly low, like something emerging from behind the surface. It scales to `1.0` and rises `28px` over 460ms on a spring cubic-bezier (`0.34, 1.26, 0.64, 1`), a trace of overshoot that makes it feel as though it has *arrived* rather than appeared. The opacity follows at 380ms ease. The closing is the reverse: a quiet descent, the panel retreating back into the surface it came from.

**The content.** The modal reads its content directly from the clicked card's DOM — no duplication, no data attributes for the basic fields. The emoji, title, short description, and tech tags are all extracted from the existing markup. A `data-detail` attribute on each card holds the extended prose — the deeper story, set in italics, separated from the preview text by a hairline border. Two registers: the immediate impression, and the quiet detail.

**Scroll lock.** While the modal is open, `overflow: hidden` is applied to `body`, with `padding-right` matched to the scrollbar width to prevent layout shift. The modal itself scrolls internally via a flex-child `.modal-scroll` with `min-height: 0` — the invariant that makes flex overflow work correctly.

**Accessibility.** The close button receives focus on open (`setTimeout` deferred past the animation frame). `Escape` closes. Clicking the blurred backdrop area (outside the panel) closes. `aria-hidden` on the backdrop is removed while open and restored after the close transition completes via a `transitionend` listener. Cards carry `role="button"`, `tabindex="0"`, and `aria-haspopup="dialog"` so keyboard users can navigate and activate them.

**The cursor.** Project cards (`role="button"`) are added to the interactive cursor selector — the dot tightens and the glow expands when hovering, signalling affordance without a native cursor.

```js
// The world blurs in — not a snap, a 440ms recession
backdrop.classList.add('is-open');   // triggers: opacity 0→1, backdrop-filter 0→blur(20px)

// Panel rises — spring overshoot, feels like it arrived
// CSS: transform: scale(0.94) translateY(28px) → scale(1) translateY(0)
//      cubic-bezier(0.34, 1.26, 0.64, 1)

// The world returns gently — transitionend for clean aria-hidden restore
backdrop.addEventListener('transitionend', () => {
  backdrop.setAttribute('aria-hidden', 'true');
}, { once: true });
```

---

## Quick Start

```bash
# No install. No build. Just open.
start index.html       # Windows
open index.html        # macOS
xdg-open index.html   # Linux
```

---

## Project Structure

```
glassmorphism-portfolio/
├── index.html     main HTML — all sections live here
├── style.css      design token system, glass utility, both themes
├── script.js      magnetic cursor, typed headline, theme toggle, reveal, skill bars, card tilt
├── README.md      you are here
└── LICENSE
```

---

## Customisation Guide

### Personalise the content

Replace the placeholder identity in `index.html`:

```html
<!-- Name in hero headline -->
<span class="name">Your Name</span>

<!-- Initials in the profile card -->
<div class="hero-card-avatar">YN</div>

<!-- Footer email -->
<a href="mailto:you@yourdomain.com">you@yourdomain.com</a>
```

### Change the accent colour

Edit two lines in `:root` in `style.css`:

```css
--accent:     #7c9cff;              /* your hue        */
--accent-dim: rgba(124,156,255,0.15); /* same at 15%  */
```

The light-mode accent lives in `[data-theme="light"]` and follows the same pattern.

### Adjust glass strength

```css
--glass-blur: 20px;                     /* higher = more frosted    */
--glass-bg:   rgba(255,255,255, 0.05);  /* higher = more opaque     */
```

---

## Animation Reference

| Animation | Trigger | Duration | Easing |
|---|---|---|---|
| Theme crossfade | Toggle click | 700ms | `ease` |
| Toggle thumb slide | Toggle click | 520ms | Spring overshoot `cubic-bezier(0.34,1.56,0.64,1)` |
| Orb colour shift | Theme switch | 700ms | `ease` |
| **Cursor dot** | Mouse move (RAF) | per-frame lerp `t=0.50` | Organic lag |
| **Cursor glow trail** | Follows dot (RAF) | per-frame lerp `t=0.07` | Heavy drift |
| **Cursor near glass** | 140px proximity | 250ms dot / 550ms glow | `ease` |
| **Cursor blend** | Theme switch | 450ms | `ease` |
| **Type one character** | RAF / setTimeout | 55–95ms random | Human variation |
| **Erase one character** | RAF / setTimeout | 35–60ms random | Mechanical, narrower |
| **Pause after full word** | Word complete | 2800ms | The long breath |
| **Pause after full erase** | Word erased | 420ms | The short breath |
| **Cursor blink** | Idle / pause | 1060ms cycle | `ease-in-out` |
| **Hero reveal — text** | Page load | 900ms | `power2.out`, delay 220ms |
| **Hero reveal — card** | Page load | 900ms | `power2.out`, delay 400ms |
| **Section child stagger** | Scroll (section top at 84vh) | 850ms per element | `power3.out`, 80ms between children |
| **Sending pulse** | Form submit | 1500ms cycle, infinite | `ease-in-out`, 38%–65% opacity |
| **Status line rise** | Send / error | 420ms | `ease` — opacity + translateY(-5px → 0) |
| **Status line fade** | Reset | 420ms | `ease` reverse — text cleared after |
| **Modal backdrop fade** | Card click | 440ms | `ease` |
| **Modal backdrop blur** | Card click | 440ms | `ease` — `blur(0)` → `blur(20px)` |
| **Modal panel rise** | Card click | 460ms | Spring `cubic-bezier(0.34,1.26,0.64,1)` |
| **Modal close descent** | Escape / close btn | 440ms | Reverse of open |
| Scroll reveal | Enter viewport | 700ms | `ease` |
| Skill bar fill | Section visible | 1200ms | `cubic-bezier(0.25,0.8,0.25,1)` |
| Card tilt | Mouse move | 100ms | `ease` |
| Hero card float | Loop | 6s | `ease-in-out` infinite |
| Orb drift | Loop | 18s | `ease-in-out` infinite alternate |

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 76+ | ✅ Full (backdrop-filter unprefixed) |
| Firefox 103+ | ✅ Full |
| Safari 14+ | ✅ Full (`-webkit-backdrop-filter`) |
| Edge 79+ | ✅ Full |
| IE 11 | ✗ Not supported |

---

## Deployment

```bash
# GitHub Pages
git init && git add . && git commit -m "init"
git branch -M main
git remote add origin https://github.com/YOUR/repo.git
git push -u origin main
# then enable Pages in repository Settings → Pages → main branch
```

Netlify and Vercel work identically — connect the repository and deploy. No build command needed.

---

## Future Enhancements

Ordered by emotional impact on the viewer.

- [x] **Dark / Light theme toggle** — spring toggle, crossfading gradient layers, system preference, `localStorage`
- [x] **Magnetic cursor** — dot + trailing glow, quadratic glass attraction, `mix-blend-mode: screen`, touch-safe
- [x] **Typed headline** — recursive `setTimeout`, five roles, 2800ms held pause, 2px blinking cursor, reduced-motion safe
- [x] **Project detail modals** — click a card; the world behind it blurs into a glass overlay
- [x] **Staggered section transitions** — sections drift in with GSAP timelines, each child delayed by 80ms
- [x] **Real contact backend** — wire the form to Formspree or EmailJS; one environment variable
- [ ] **Ambient particle field** — a slow, sparse `<canvas>` constellation behind the orbs
- [ ] **Blog / writing section** — thoughts rendered from Markdown; the voice behind the work
- [ ] **PWA support** — `manifest.json` and a service worker for offline reading
- [ ] **Multilingual support** — a second language, a second self
- [ ] **Image optimisation** — WebP with `srcset`, native lazy loading

---

## Design Philosophy

Glass works because it is honest about what it is. It does not pretend to be solid. It holds the background loosely, lets it breathe through — distorted, softened, present. That tension between transparency and definition is the whole feeling.

The melancholy comes from the details no one names but everyone feels: the 0.05 opacity that almost isn't there. The border at 12% that catches the light. The shadow soft enough to feel like memory rather than depth.

Build interfaces the way a sculptor approaches stone — subtract until only what matters remains.

---

## Performance

- **Bundle size**: ~18 KB uncompressed (HTML + CSS + JS)
- **Dependencies**: zero (Google Fonts only, loaded async)
- **Animations**: GPU-accelerated `transform` and `opacity` only
- **Target**: 60fps on any device from 2018 onward

---

## License

[MIT](LICENSE) — personal and commercial use welcome.

---

**Made with intention by [Cristian Sifuentes](https://github.com/CristianSifuentes)**

*Last updated: 2026*
