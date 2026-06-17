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
| ✓ | **Glassmorphism card system** | `.glass` utility — backdrop blur, translucent fill, luminous border, soft shadow |
| ✓ | **Floating hero card** | Sine-wave float animation with subtle 3-axis mouse tilt |
| ✓ | **Scroll reveal** | `IntersectionObserver` — elements rise as they enter the viewport |
| ✓ | **Animated skill bars** | Fill on scroll entry via `data-width`; eased cubic-bezier fill |
| ✓ | **Responsive layout** | CSS Grid, `clamp()` fluid type, graceful mobile collapse |
| ✓ | **Contact form feedback** | Submit state with colour confirmation and auto-reset |

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
├── script.js      theme toggle, reveal, skill bars, card tilt
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
| Toggle thumb slide | Toggle click | 520ms | Spring overshoot |
| Orb colour shift | Theme switch | 700ms | `ease` |
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
- [ ] **Magnetic cursor** — a soft glow that follows the mouse, drawn toward glass cards like a moth to light
- [ ] **Typed headline** — the hero `h1` cycles through roles with a typewriter cursor and a long pause between
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
