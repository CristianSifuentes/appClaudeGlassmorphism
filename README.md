# Glassmorphism Portfolio
### *A surface made of frozen light.*

A single-page personal portfolio built with pure HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies. Open `index.html` and it breathes.

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
- [ ] **Project detail modals** — click a card; the world behind it blurs into a glass overlay
- [ ] **Staggered section transitions** — sections drift in with GSAP timelines, each child delayed by 80ms
- [ ] **Real contact backend** — wire the form to Formspree or EmailJS; one environment variable
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
