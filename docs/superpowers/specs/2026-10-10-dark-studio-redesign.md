# MasterBuilder.pl — Dark Studio Redesign

**Date:** 2026-10-10  
**Status:** Approved for implementation

---

## Overview

Complete visual redesign of masterbuilder.pl — an AFOL (Adult Fan of LEGO) site showcasing custom MOC builds. Goals: make photos the hero, drive traffic to Rebrickable instructions, and encourage coffee sponsorship. English only. No community features, no auth.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Theme | Dark Studio |
| Background | Warm charcoal `#1e1c19`, nav/footer `#191710` |
| Accent | Antique gold `#c9a84c` |
| Headline font | Bebas Neue (Google Fonts) |
| Body font | DM Sans (Google Fonts) |
| Layout | Full-width masonry grid |
| Language | English only — remove all PL/bilingual code |

---

## Color Tokens

```css
--bg:        #1e1c19;   /* page background */
--bg-deep:   #191710;   /* nav, footer, cards */
--bg-card:   #161410;   /* tile backgrounds, badge */
--gold:      #c9a84c;   /* primary accent */
--text:      #ede8df;   /* primary text */
--text-dim:  #9a9080;   /* secondary text, placeholders */
--border:    rgba(255,255,255,0.07);
--pad:       clamp(1rem, 4vw, 2.5rem);  /* horizontal page padding */
```

---

## Layout & Responsive Breakpoints

| Viewport | Masonry columns | Tile height |
|---|---|---|
| >900px (desktop) | 4 | 200px |
| 560–900px (tablet) | 3 | 180px |
| 340–560px (mobile) | 2 | 150px |
| <340px (tiny) | 1 | auto |

All font sizes use `clamp()` to scale smoothly. `--pad` drives all horizontal spacing.

---

## Components

### Nav (sticky)
- Logo box (gold square with brick icon) + "MasterBuilder" in Bebas Neue
- Search input (pill, dark background, magnifier icon) — links to `/search/`
- Instagram icon button (gradient) — links to `https://www.instagram.com/masterbuilder.pl`
- Facebook icon button (blue) — links to `https://www.facebook.com/pl.masterbuilder`
- No menu items, no language switcher

### Hero
- Kicker: `MY OWN CREATIONS · ADULT LEGO BUILDER` in gold, spaced caps
- H1: `PASSION. / DETAILS. / BRICKS.` — Bebas Neue, `clamp(3rem, 9vw, 5.5rem)`, middle line in gold
- Subtitle: one sentence, DM Sans, `var(--text-dim)`
- CTAs: `Browse MOCs` (gold filled) + `☕ Buy me a coffee` (ghost border)
- Right side: Rebrickable badge showing instruction count + `Shop instructions →` link — hidden on mobile (<600px)

### Masonry Grid
- CSS Grid with `grid-auto-rows` and tile span classes: `.tall` (row-span 2), `.wide` (col-span 2)
- Each tile: photo fills 100%, dark gradient overlay at bottom
- Overlay: tag chip (gold for MOC, blue for Star Wars, teal for Animals) + Bebas Neue title + date
- On hover: `transform: scale(1.012)` + `Get instructions →` gold badge fades in top-right
- Tiles link to the post page

### Support Strip
- Dark card, gold border
- Left: ☕ icon + heading `ENJOY THE BUILDS? SUPPORT MY WORK` + subtitle
- Right: `Buy me a coffee` (amber) + `Shop on Rebrickable` (red) buttons
- Stacks vertically on mobile (<520px), buttons go full-width

### Footer
- `MasterBuilder.pl` in Bebas Neue gold
- Copyright line in `var(--text-dim)`
- Instagram + Facebook icon buttons (same as nav)

---

## Page Structure

### Homepage (`/`)
Hero → masonry grid (all posts, sorted by date) → support strip → footer.

### Post page (`/posts/[slug]/`)
Sticky nav → post title (Bebas Neue) → date + tag chips → hero image (full-width, `object-fit: cover`) → optional "Get free instructions" button (gold) or "Buy on Rebrickable" button (red) → post content (DM Sans, 1.15rem, generous line-height) → support strip → footer.

### Search page (`/search/`)
Existing Lunr.js search, restyled with same dark theme. Results use the same tile component.

---

## Eleventy Changes

- Remove all `language`, `selectLang`, Polish content, bilingual data
- `src/_data/site.json` — remove `languages` array and bilingual menu labels
- `src/_data/translations.js` — delete (no longer needed)
- Post frontmatter — remove `language: en` field (no longer meaningful)
- `src/pl/` directory — delete entirely
- `src/en/` — move contents up to `src/` (posts live at `src/posts/`)
- URL structure: `/posts/[slug]/` instead of `/en/posts/[slug]/`
- `src/index.njk` — new homepage template (hero + masonry grid)
- `src/_includes/base.njk` — updated shell with new nav/footer, new Google Fonts import
- `src/_includes/layout.njk` — updated post layout
- `src/_includes/post-tiles.njk` — replace with masonry tile macro
- `public/styles.css` — full rewrite with CSS tokens above

---

## Post Frontmatter (new)

```yaml
---
title: Medieval Castle — Ratusz
date: 2025-09-01
layout: layout.njk
tags: [moc]          # moc | star-wars | animals | news
image: /public/zamek/zamek.jpg
description: A medieval town hall with a clock tower…
rebrickable: https://rebrickable.com/mocs/…   # optional — shows red buy button
instruction: /public/zamek/zamek_instrukcja.pdf  # optional — shows gold free button
---
```

---

## Out of Scope

- Polish content / bilingual support
- User accounts, comments, community features
- Tag filter UI on the homepage (tags exist but no filter widget — tags link to tag pages)
- CMS or admin interface
- Dark/light mode toggle
