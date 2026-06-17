/* ─────────────────────────────────────────────────────────────────
   POSTS — the voice behind the work
   Each entry is a thought rendered from Markdown.
   Add new writing by appending to this array.

   Fields:
     slug     — URL-safe identifier (unused for now, ready for routing)
     date     — ISO 8601 string: 'YYYY-MM-DD'
     title    — post title
     excerpt  — 1–2 sentence preview shown on the card
     readTime — e.g. '3 min'
     content  — full post body in Markdown
   ───────────────────────────────────────────────────────────────── */

const POSTS = [
  {
    slug:     'on-negative-space',
    date:     '2026-04-14',
    title:    'On Negative Space',
    excerpt:  'There is a moment in every design when adding more makes it less. You have placed the elements, balanced the hierarchy, chosen the type. And then you notice the space between things.',
    readTime: '3 min',
    content: `
There is a moment in every design when adding more makes it less. You have placed the elements, balanced the hierarchy, chosen the type. And then you notice the space between things — the quiet distance from one word to the next, the margin that holds the eye before it moves. You want to fill it.

Resist.

The white around a word is not empty. It is the pause before the meaning arrives. Negative space is not the absence of design — it is design making room for the reader to think. A crowded layout leaves no room for the reader's imagination. A spare one invites it in.

> The best things I have built are defined more by what I chose not to include than by what I left in.

I have deleted more from my work than I have kept. Every removed element was a decision to trust the viewer — to believe that they could fill the silence with something of their own.

That trust is the whole practice.
`,
  },

  {
    slug:     'the-melancholy-of-shipped-work',
    date:     '2026-03-28',
    title:    'The Melancholy of Shipped Work',
    excerpt:  'There is a specific sadness to shipping something. It is not failure. The work is done, the tests pass, the client is pleased. But the moment a design is released, it stops being yours.',
    readTime: '4 min',
    content: `
There is a specific sadness to shipping something.

It is not failure. The work is done, the tests pass, the client is pleased. But the moment a design is released into the world, it stops being yours. It becomes *used*. It accumulates the patina of real use — the edge cases you didn't anticipate, the user who holds their phone sideways, the late-night dark mode you never tested against a warm screen at 2 a.m.

The version in your head — the ideal version, the one you were still refining when the deadline passed — that version no longer exists. What exists is the shipped version, with its compromises and its slightly-too-tight mobile padding and the one interaction you never quite got right.

> I have learned to grieve it briefly, then let it go.

The next thing is already waiting. The next design still lives in the possible. The shipped work belongs to the world now. The work in your head still belongs to you — and it is, as always, more beautiful than anything that can be built.

This is not a problem to solve. It is the condition of making things.
`,
  },

  {
    slug:     'glass',
    date:     '2026-03-05',
    title:    'Glass',
    excerpt:  'I became interested in glass as a material — not the substance, but the idea of it. Transparency with a surface. Something that holds the light without owning it.',
    readTime: '3 min',
    content: `
I became interested in glass as a material — not the substance, but the *idea* of it. Transparency with a surface. Something that holds the light without owning it.

The design world borrowed this metaphor and called it *glassmorphism* — backdrop blur, translucent fills, luminous borders. But the word makes it sound like a style. It is closer to a philosophy.

**What if the interface admitted that it was in front of something?**

A glass surface says: *I am here, but so is the world behind me.* It does not occlude; it mediates. The background bleeds through. The text catches the light. Nothing is fully opaque, nothing is fully invisible. The depth is not simulated — it is genuine distance, preserved through the material.

---

I think most honest design works this way. It does not hide the complexity behind it. It holds complexity at a remove: blurred and present, visible through whatever has been built in front of it.

The metaphor breaks eventually — every metaphor does. But while it holds, it teaches something true: that the surface and the depth are not opposites. One makes the other visible.
`,
  },
];
