# Dark Studio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing yellow/orange Eleventy site with a full-width dark studio design — warm charcoal background, antique gold accents, Bebas Neue headlines, masonry photo grid, English-only.

**Architecture:** The existing Eleventy + Nunjucks stack is kept. `src/pl/` is deleted; `src/en/` content moves to `src/posts/`. A single CSS file (`public/styles.css`) is fully rewritten using CSS custom properties. Templates (`base.njk`, `layout.njk`, `post-tiles.njk`) and Eleventy config (`.eleventy.js`) are updated in-place. The search JS is updated to drop the language filter.

**Tech Stack:** Eleventy 3.x, Nunjucks, vanilla CSS (no preprocessor), Lunr.js (existing), Google Fonts (Bebas Neue + DM Sans).

**Spec:** `docs/superpowers/specs/2026-10-10-dark-studio-redesign.md`

## Global Constraints

- Colors: `--bg #1e1c19`, `--bg-deep #191710`, `--bg-card #161410`, `--gold #c9a84c`, `--text #ede8df`, `--text-dim #9a9080`
- Fonts: Bebas Neue (headlines), DM Sans (body/UI) — both from Google Fonts
- Responsive breakpoints: >900px = 4 cols, 560–900px = 3 cols, 340–560px = 2 cols, <340px = 1 col; tile heights 200/180/150px
- All horizontal spacing via `--pad: clamp(1rem, 4vw, 2.5rem)`
- English only — no `language` frontmatter field, no bilingual data, no `/pl/` URLs
- New post URL structure: `/posts/[slug]/` (was `/en/posts/[slug]/`)
- Dev server: `npx @11ty/eleventy --serve`

## Review Focus

- **Missing `image` frontmatter** — a post without `image` must not break the masonry grid; tile should show `var(--bg-card)` solid background (no broken `<img>`). Covered in Task 4.
- **Missing `rebrickable` and `instruction` frontmatter** — post layout must render cleanly with neither button present. Covered in Task 5.
- **Search after language removal** — `search.js` currently filters by `doc.lang === document.documentElement.lang`; after removing that filter all posts must appear. Covered in Task 6.
- **`search-index.11ty.js` still reads from `src/en/posts/`** — after moving posts to `src/posts/` the index generator must be updated or search returns zero results. Covered in Task 6.
- **Tag pages still use `item.lang` in permalink** — `src/tags.njk` generates `/[lang]/tags/[slug]/`; after removing language the tag URLs must be updated to `/tags/[slug]/`. Covered in Task 3.

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Delete | `src/pl/` (entire dir) | Polish content, no longer needed |
| Move | `src/en/posts/*.md` → `src/posts/*.md` | Flatten URL to `/posts/[slug]/` |
| Move | `src/en/index.njk` → `src/index.njk` (replace) | New homepage |
| Move | `src/en/search.njk` → `src/search.njk` | Search page |
| Move | `src/en/about.md` → `src/about.md` | About page |
| Delete | `src/en/mocs.njk` | No longer a separate page |
| Delete | `src/_data/translations.js` | Bilingual UI strings, not needed |
| Modify | `src/_data/site.json` | Remove `languages`, simplify menu |
| Modify | `.eleventy.js` | Remove bilingual collections/filters |
| Rewrite | `public/styles.css` | Full dark studio CSS |
| Rewrite | `src/_includes/base.njk` | New nav + footer + fonts |
| Rewrite | `src/_includes/layout.njk` | New post layout |
| Rewrite | `src/_includes/post-tiles.njk` | Masonry tile macro |
| Rewrite | `src/index.njk` | Hero + masonry homepage |
| Modify | `src/search.njk` | Restyled search page |
| Modify | `src/search-index.11ty.js` | Read from `src/posts/` |
| Modify | `public/search.js` | Remove language filter |
| Modify | `src/tags.njk` | Remove lang from permalink |
| Modify | `src/sitemap.njk` | Update URL patterns |

---

### Task 1: CSS foundations — tokens, reset, typography

**Files:**
- Modify: `public/styles.css` (full rewrite)

**Interfaces:**
- Produces: CSS custom properties and base typography classes consumed by all subsequent tasks

- [ ] **Step 1: Replace `public/styles.css` entirely** with the following:

```css
/* ── Reset & tokens ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #1e1c19;
  --bg-deep:  #191710;
  --bg-card:  #161410;
  --gold:     #c9a84c;
  --gold-dim: #8a6e2a;
  --text:     #ede8df;
  --text-dim: #9a9080;
  --border:   rgba(255,255,255,0.07);
  --pad:      clamp(1rem, 4vw, 2.5rem);
  --radius:   8px;
}

html { font-size: 16px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
  width: 100%;
  line-height: 1.6;
}
img { display: block; max-width: 100%; }
a { color: inherit; }

/* ── Typography ── */
h1, h2, h3, .font-display {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.03em;
  line-height: 1;
}
h1 { font-size: clamp(2rem, 6vw, 3.5rem); }
h2 { font-size: clamp(1.4rem, 4vw, 2rem); }
h3 { font-size: clamp(1rem, 2.5vw, 1.3rem); }

.kicker {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* ── Buttons ── */
.btn-primary {
  display: inline-block;
  background: var(--gold); color: #13110a;
  font-family: 'DM Sans', sans-serif; font-weight: 700;
  font-size: clamp(0.78rem, 2vw, 0.88rem);
  padding: 0.55rem 1.2rem; border-radius: 6px;
  text-decoration: none; border: none; cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: #dbb94e; }

.btn-ghost {
  display: inline-block;
  border: 1px solid rgba(201,168,76,0.35); color: var(--text-dim);
  font-family: 'DM Sans', sans-serif; font-weight: 600;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  padding: 0.5rem 1rem; border-radius: 6px;
  text-decoration: none; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

.btn-coffee {
  display: inline-block;
  background: #f5a623; color: #1a0e00;
  font-family: 'DM Sans', sans-serif; font-weight: 700;
  font-size: clamp(0.75rem, 2vw, 0.82rem);
  padding: 0.5rem 1.1rem; border-radius: 6px;
  text-decoration: none; white-space: nowrap;
}
.btn-rebrickable {
  display: inline-block;
  background: #e63c2f; color: #fff;
  font-family: 'DM Sans', sans-serif; font-weight: 700;
  font-size: clamp(0.75rem, 2vw, 0.82rem);
  padding: 0.5rem 1.1rem; border-radius: 6px;
  text-decoration: none; white-space: nowrap;
}

/* ── Tag chips ── */
.tag {
  display: inline-block;
  background: var(--gold); color: #13110a;
  font-size: 0.6rem; font-weight: 800;
  padding: 2px 7px; border-radius: 3px;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none;
}
.tag.blue { background: #3a6df0; color: #fff; }
.tag.teal { background: #1a8a7a; color: #fff; }
.tag.neutral { background: rgba(255,255,255,0.1); color: var(--text-dim); }

/* ── Social icons ── */
.social-icon {
  width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  transition: opacity 0.15s;
}
.social-icon:hover { opacity: 0.8; }
.social-icon.ig {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}
.social-icon.fb { background: #1877F2; }
.social-icon svg { width: 15px; height: 15px; fill: #fff; }

/* ── Support strip ── */
.support-strip {
  margin: clamp(1rem, 4vw, 1.8rem) var(--pad) 0;
  background: var(--bg-card);
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 10px;
  padding: 1rem 1.3rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  flex-wrap: wrap;
}
.support-left { display: flex; align-items: center; gap: 0.75rem; }
.support-icon { font-size: 1.5rem; flex-shrink: 0; }
.support-text h3 { font-size: clamp(1rem, 3vw, 1.15rem); color: var(--text); }
.support-text p { font-size: clamp(0.72rem, 2vw, 0.8rem); color: var(--text-dim); margin-top: 2px; }
.support-actions { display: flex; gap: 0.55rem; flex-wrap: wrap; }

@media (max-width: 520px) {
  .support-strip { flex-direction: column; align-items: flex-start; }
  .support-actions { width: 100%; }
  .btn-coffee, .btn-rebrickable { flex: 1; text-align: center; }
}
```

- [ ] **Step 2: Start dev server and verify the site loads without CSS errors**

```bash
npx @11ty/eleventy --serve
```

Open `http://localhost:8080` — expect a dark background and readable text (layout will be unstyled until later tasks).

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat: css foundations — dark studio tokens, typography, buttons"
```

---

### Task 2: Data cleanup — remove bilingual config, simplify Eleventy

**Files:**
- Modify: `src/_data/site.json`
- Delete: `src/_data/translations.js`
- Modify: `.eleventy.js`

**Interfaces:**
- Produces: `collections.posts` — array of post objects from `src/posts/*.md`, sorted by date descending, no `language` field
- Produces: `collections.tagList` — array of `{ tag, slug }` objects (no `lang` field)

- [ ] **Step 1: Update `src/_data/site.json`**

Replace the entire file with:

```json
{
  "url": "https://masterbuilder.pl",
  "instagram": "https://www.instagram.com/masterbuilder.pl",
  "facebook": "https://www.facebook.com/pl.masterbuilder",
  "rebrickable": "https://rebrickable.com/users/masterbuilder2222/mocs/"
}
```

- [ ] **Step 2: Delete `src/_data/translations.js`**

```bash
rm src/_data/translations.js
```

- [ ] **Step 3: Rewrite `.eleventy.js`** — remove all bilingual logic, update glob paths:

```js
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLLL yyyy");
  });

  eleventyConfig.addFilter("selectTag", function (arr, tag) {
    if (!Array.isArray(arr)) return [];
    if (!tag) return arr;
    const normalized = tag.toLowerCase();
    return arr.filter(item => {
      if (!item.data.tags) return false;
      return item.data.tags.some(t => t.toLowerCase() === normalized);
    });
  });

  eleventyConfig.addFilter("sortByDate", function (arr) {
    if (!Array.isArray(arr)) return [...arr].sort((a, b) => b.date - a.date);
    return [...arr].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagSet = new Set();
    const tagNorm = {};
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag === "post" || tag === "news" || tag === "moc") return;
        const slug = tag.toLowerCase().replace(/\s+/g, "-");
        tagSet.add(slug);
        if (!tagNorm[slug]) {
          tagNorm[slug] = tag.split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        }
      });
    });
    return [...tagSet].map(slug => ({ tag: tagNorm[slug] || slug, slug }));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
```

- [ ] **Step 4: Verify Eleventy starts without errors**

```bash
npx @11ty/eleventy --serve
```

Expected: server starts, no "collections not found" or "translations not defined" errors in the terminal.

- [ ] **Step 5: Commit**

```bash
git add src/_data/site.json .eleventy.js
git rm src/_data/translations.js
git commit -m "feat: remove bilingual data, simplify eleventy config to single-language"
```

---

### Task 3: Content migration — move posts, delete Polish, fix tag pages

**Files:**
- Move: `src/en/posts/*.md` → `src/posts/*.md`
- Move: `src/en/about.md` → `src/about.md`
- Move: `src/en/search.njk` → `src/search.njk`
- Delete: `src/pl/` (entire directory)
- Delete: `src/en/` (entire directory, after moving files)
- Delete: `src/index.html` (redirect stub replaced by new `index.njk`)
- Modify: `src/tags.njk`
- Modify: `src/sitemap.njk`

**Interfaces:**
- Consumes: `collections.posts` glob now reads `src/posts/*.md`
- Produces: posts at `/posts/[slug]/`, tag pages at `/tags/[slug]/`

- [ ] **Step 1: Create `src/posts/` and move English posts**

```bash
mkdir -p src/posts
cp src/en/posts/*.md src/posts/
```

- [ ] **Step 2: Strip `language: en` from every moved post's frontmatter**

```bash
cd src/posts
for f in *.md; do
  sed -i '' '/^language:/d' "$f"
done
cd ../..
```

- [ ] **Step 3: Move remaining English pages**

```bash
cp src/en/about.md src/about.md
cp src/en/search.njk src/search.njk
```

- [ ] **Step 4: Delete Polish and English source directories and old index stub**

```bash
rm -rf src/pl src/en src/index.html
```

- [ ] **Step 5: Update `src/tags.njk`** — remove `lang` from permalink and template variables:

```njk
---
pagination:
  data: collections.tagList
  size: 1
  alias: item
permalink: "/tags/{{ item.slug }}/"
layout: layout.njk
eleventyExcludeFromCollections: true
eleventyComputed:
  title: "Posts tagged '{{ item.tag }}'"
---

{% set postsForTag = collections.posts | selectTag(item.tag) %}
{% import "./_includes/post-tiles.njk" as pt %}
{{ pt.post_tiles(postsForTag) }}
```

- [ ] **Step 6: Update `src/sitemap.njk`** — replace any `/en/` or `/pl/` prefixes with direct paths. Open the file and remove language-prefixed URL patterns so it reads:

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for item in collections.all %}
  {% if item.url and not item.url.startsWith('/tags/') %}
  <url>
    <loc>{{ site.url }}{{ item.url }}</loc>
    <lastmod>{{ item.date | date }}</lastmod>
  </url>
  {% endif %}
  {% endfor %}
</urlset>
```

- [ ] **Step 7: Start dev server and verify posts resolve**

```bash
npx @11ty/eleventy --serve
```

Open `http://localhost:8080/posts/zamek/` — page should load (unstyled is fine). Open `http://localhost:8080/tags/moc/` — should list MOC posts.

- [ ] **Step 8: Commit**

```bash
git add src/posts/ src/about.md src/search.njk src/tags.njk src/sitemap.njk
git rm -r src/pl/ src/en/ src/index.html
git commit -m "feat: migrate content to src/posts/, remove polish content, fix tag URLs"
```

---

### Task 4: Nav, base shell, and masonry tile component

**Files:**
- Rewrite: `src/_includes/base.njk`
- Rewrite: `src/_includes/post-tiles.njk`
- Modify: `public/styles.css` (append nav + masonry styles)

**Interfaces:**
- Produces: `base.njk` — Nunjucks block `{% block content %}` shell used by all layouts
- Produces: `post_tiles(posts)` macro — renders a `.masonry` grid; consumed by `index.njk` and `tags.njk`

- [ ] **Step 1: Rewrite `src/_includes/base.njk`**

```njk
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or "MasterBuilder.pl" }}</title>
  <meta name="description" content="{{ description or content | striptags | truncate(155) }}">
  <meta property="og:title" content="{{ title or 'MasterBuilder.pl' }}">
  <meta property="og:description" content="{{ description or content | striptags | truncate(155) }}">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:image" content="{{ site.url }}{{ image or '/public/logo.png' }}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{{ site.url }}{{ image or '/public/logo.png' }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/styles.css">
  <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body>

<nav class="site-nav">
  <a class="nav-logo" href="/">
    <div class="nav-logo-box">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="6" width="6" height="4" rx="1" fill="#13110a"/>
        <rect x="9" y="6" width="6" height="4" rx="1" fill="#13110a"/>
        <rect x="3" y="4" width="2" height="3" rx="0.5" fill="#13110a"/>
        <rect x="11" y="4" width="2" height="3" rx="0.5" fill="#13110a"/>
      </svg>
    </div>
    <span class="nav-brand">MasterBuilder</span>
  </a>

  <a class="nav-search" href="/search/">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
      <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span>Search builds…</span>
  </a>

  <a class="social-icon ig" href="{{ site.instagram }}" target="_blank" rel="noopener" aria-label="Instagram">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  </a>
  <a class="social-icon fb" href="{{ site.facebook }}" target="_blank" rel="noopener" aria-label="Facebook">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  </a>
</nav>

{% block content %}{% endblock %}

<div class="support-strip">
  <div class="support-left">
    <div class="support-icon">☕</div>
    <div class="support-text">
      <h3>Enjoy the builds? Support my work</h3>
      <p>Every coffee keeps the bricks coming. Buy instructions on Rebrickable and build them yourself.</p>
    </div>
  </div>
  <div class="support-actions">
    <a class="btn-coffee" href="https://www.buymeacoffee.com/masterbuilder" target="_blank" rel="noopener">Buy me a coffee</a>
    <a class="btn-rebrickable" href="{{ site.rebrickable }}" target="_blank" rel="noopener">Shop on Rebrickable</a>
  </div>
</div>

<footer class="site-footer">
  <span class="footer-brand">MasterBuilder.pl</span>
  <span class="footer-copy">&copy; {{ page.date.getFullYear() if page.date else "2026" }} &middot; Handcrafted LEGO builds</span>
  <div class="footer-social">
    <a class="social-icon ig" href="{{ site.instagram }}" target="_blank" rel="noopener" aria-label="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a class="social-icon fb" href="{{ site.facebook }}" target="_blank" rel="noopener" aria-label="Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
  </div>
</footer>

<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "307001038ff84970a9335b23a8967323"}'></script>
</body>
</html>
```

- [ ] **Step 2: Append nav + masonry styles to `public/styles.css`**

```css
/* ── Nav ── */
.site-nav {
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border);
  padding: 0.65rem var(--pad);
  display: flex; align-items: center; gap: 0.75rem;
  position: sticky; top: 0; z-index: 10;
}
.nav-logo {
  display: flex; align-items: center; gap: 0.45rem;
  text-decoration: none; margin-right: auto; flex-shrink: 0;
}
.nav-logo-box {
  width: 28px; height: 28px; background: var(--gold);
  border-radius: 5px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.nav-brand {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.25rem; color: var(--gold); letter-spacing: 0.06em;
}
@media (max-width: 380px) { .nav-brand { display: none; } }

.nav-search {
  display: flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px; padding: 0.35rem 0.75rem;
  text-decoration: none; color: var(--text-dim);
  flex: 1; max-width: 280px;
  transition: border-color 0.15s;
}
.nav-search:hover { border-color: rgba(201,168,76,0.4); }
.nav-search span { font-size: 0.78rem; white-space: nowrap; overflow: hidden; }
@media (max-width: 480px) { .nav-search { max-width: 120px; } }

/* ── Footer ── */
.site-footer {
  margin-top: clamp(1.2rem, 4vw, 2rem);
  background: var(--bg-deep);
  border-top: 1px solid var(--border);
  padding: 1.1rem var(--pad);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.7rem;
}
.footer-brand {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem; color: var(--gold); letter-spacing: 0.06em;
}
.footer-copy { font-size: 0.7rem; color: var(--text-dim); }
.footer-social { display: flex; gap: 0.4rem; }

/* ── Masonry tile grid ── */
.section-head {
  display: flex; align-items: baseline; justify-content: space-between;
  padding: clamp(1.2rem, 4vw, 1.8rem) var(--pad) 0.8rem;
}
.section-head h2 {
  font-size: clamp(1.2rem, 4vw, 1.7rem);
  letter-spacing: 0.04em;
}
.section-link { font-size: 0.78rem; color: var(--gold); font-weight: 600; text-decoration: none; }

.masonry {
  display: grid;
  padding: 0 var(--pad);
  gap: 6px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
}
@media (max-width: 900px) {
  .masonry { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 180px; }
}
@media (max-width: 560px) {
  .masonry { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; gap: 4px; }
  .tile.tall  { grid-row: span 1; }
}
@media (max-width: 340px) {
  .masonry { grid-template-columns: 1fr; }
  .tile.wide { grid-column: span 1; }
}

.tile {
  position: relative; border-radius: var(--radius); overflow: hidden;
  cursor: pointer; background: var(--bg-card);
  transition: transform 0.2s;
  display: block; text-decoration: none;
}
.tile:hover { transform: scale(1.012); }
.tile.tall { grid-row: span 2; }
.tile.wide { grid-column: span 2; }

.tile img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.tile-no-image {
  width: 100%; height: 100%; background: var(--bg-card);
}

.tile-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 0.8rem 0.75rem 0.65rem;
  background: linear-gradient(transparent 0%, rgba(10,8,5,0.94) 100%);
}
.tile-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(0.85rem, 2.5vw, 1.1rem);
  color: #fff; letter-spacing: 0.03em; line-height: 1.1;
  display: block; margin-top: 0.25rem;
}
.tile-date { font-size: 0.58rem; color: rgba(255,255,255,0.42); margin-top: 2px; }

.tile-cta {
  position: absolute; top: 0.55rem; right: 0.55rem;
  background: var(--gold); color: #13110a;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.56rem; font-weight: 800; padding: 3px 7px; border-radius: 4px;
  opacity: 0; transition: opacity 0.2s; text-decoration: none;
}
.tile:hover .tile-cta { opacity: 1; }
```

- [ ] **Step 3: Rewrite `src/_includes/post-tiles.njk`** — masonry tile macro:

```njk
{% macro post_tiles(posts) %}
<div class="masonry">
  {% for post in posts %}
    {% if loop.first %}
      <a href="{{ post.url }}" class="tile tall" aria-label="{{ post.data.title }}">
    {% elif loop.index == 4 %}
      <a href="{{ post.url }}" class="tile wide" aria-label="{{ post.data.title }}">
    {% else %}
      <a href="{{ post.url }}" class="tile" aria-label="{{ post.data.title }}">
    {% endif %}
      {% if post.data.image %}
        <img src="{{ post.data.image }}" alt="{{ post.data.title }}" loading="lazy">
      {% else %}
        <div class="tile-no-image"></div>
      {% endif %}
      {% if post.data.rebrickable or post.data.instruction %}
        <span class="tile-cta">Get instructions →</span>
      {% endif %}
      <div class="tile-overlay">
        {% for tag in post.data.tags %}
          {% if tag != 'post' and tag != 'news' and tag != 'moc' %}
            <a href="/tags/{{ tag | slugify }}/" class="tag neutral" onclick="event.stopPropagation()">{{ tag }}</a>
          {% elif tag == 'moc' %}
            <span class="tag">MOC</span>
          {% endif %}
        {% endfor %}
        <span class="tile-title">{{ post.data.title }}</span>
        <div class="tile-date">{{ post.date | readableDate }}</div>
      </div>
    </a>
  {% endfor %}
</div>
{% endmacro %}
```

- [ ] **Step 4: Verify in browser**

```bash
npx @11ty/eleventy --serve
```

Open `http://localhost:8080` — expect the dark sticky nav with logo, search link, and social icons. Footer should appear at bottom of every page.

- [ ] **Step 5: Commit**

```bash
git add src/_includes/base.njk src/_includes/post-tiles.njk public/styles.css
git commit -m "feat: dark studio nav, footer, masonry tile component"
```

---

### Task 5: Homepage and post layout

**Files:**
- Create/Rewrite: `src/index.njk`
- Rewrite: `src/_includes/layout.njk`
- Modify: `public/styles.css` (append hero + post styles)

**Interfaces:**
- Consumes: `collections.posts` (from Task 2), `post_tiles` macro (from Task 4)
- Consumes: post frontmatter fields: `title`, `date`, `image`, `tags`, `description`, `rebrickable`, `instruction`

- [ ] **Step 1: Rewrite `src/index.njk`**

```njk
---
title: MasterBuilder.pl — LEGO MOC Builds & Instructions
layout: base.njk
description: "Handcrafted LEGO builds by MasterBuilder — original MOCs with free and paid instructions."
---

{% block content %}
<section class="hero">
  <div class="hero-left">
    <p class="kicker">My Own Creations &middot; Adult LEGO Builder</p>
    <h1 class="hero-h1">PASSION.<br><span class="accent">DETAILS.</span><br>BRICKS.</h1>
    <p class="hero-sub">Handcrafted LEGO builds — from Star Wars dioramas to medieval castles. Every MOC comes with free or paid instructions.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="#builds">Browse MOCs</a>
      <a class="btn-ghost" href="https://www.buymeacoffee.com/masterbuilder" target="_blank" rel="noopener">☕ Buy me a coffee</a>
    </div>
  </div>
  <div class="hero-right">
    <div class="rebrickable-badge">
      <span class="rb-label">Instructions on</span>
      <span class="rb-count">9+</span>
      <span class="rb-sub">Rebrickable</span>
      <a class="btn-primary rb-btn" href="{{ site.rebrickable }}" target="_blank" rel="noopener">Shop instructions →</a>
    </div>
  </div>
</section>

<div class="section-head" id="builds">
  <h2>Latest Builds</h2>
</div>

{% import "_includes/post-tiles.njk" as pt %}
{{ pt.post_tiles(collections.posts) }}
{% endblock %}
```

- [ ] **Step 2: Rewrite `src/_includes/layout.njk`** — post detail layout:

```njk
{% extends "base.njk" %}
{% block content %}
<article class="post">
  <header class="post-header">
    <div class="post-meta-top">
      {% for tag in tags %}
        {% if tag != 'post' and tag != 'news' %}
          <a href="/tags/{{ tag | slugify }}/" class="tag{% if tag == 'moc' %}{% elif tag == 'star-wars' or tag == 'Star Wars' %} blue{% else %} neutral{% endif %}">{{ tag | upper }}</a>
        {% endif %}
      {% endfor %}
      {% if page.date %}
        <span class="post-date">{{ page.date | readableDate }}</span>
      {% endif %}
    </div>
    <h1 class="post-title">{{ title }}</h1>
  </header>

  {% if image %}
    <div class="post-hero-img-wrap">
      <img src="{{ image }}" alt="{{ title }}" class="post-hero-img">
    </div>
  {% endif %}

  <div class="post-actions">
    {% if instruction %}
      <a class="btn-primary" href="{{ instruction }}" target="_blank" rel="noopener">Get free instructions</a>
    {% endif %}
    {% if rebrickable %}
      <a class="btn-rebrickable" href="{{ rebrickable }}" target="_blank" rel="noopener">Buy on Rebrickable</a>
    {% endif %}
  </div>

  <div class="post-content">
    {{ content | safe }}
  </div>
</article>
{% endblock %}
```

- [ ] **Step 3: Append hero + post styles to `public/styles.css`**

```css
/* ── Hero ── */
.hero {
  padding: clamp(1.5rem, 5vw, 3rem) var(--pad) clamp(1.2rem, 4vw, 2.5rem);
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: end;
}
@media (max-width: 600px) {
  .hero { grid-template-columns: 1fr; }
  .hero-right { display: none; }
}

.hero-h1 {
  font-size: clamp(3rem, 9vw, 5.5rem);
  line-height: 0.9; color: var(--text);
}
.hero-h1 .accent { color: var(--gold); }
.hero-sub {
  font-size: clamp(0.82rem, 2vw, 0.95rem); color: var(--text-dim);
  line-height: 1.65; margin-top: 0.8rem; max-width: 480px;
}
.hero-ctas { display: flex; gap: 0.65rem; margin-top: 1.3rem; flex-wrap: wrap; }

.rebrickable-badge {
  display: inline-flex; flex-direction: column; align-items: center;
  background: var(--bg-card); border: 1px solid rgba(201,168,76,0.2);
  border-radius: 10px; padding: 0.85rem 1.1rem; gap: 0.2rem; text-align: center;
}
.rb-label { font-size: 0.58rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
.rb-count { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: var(--gold); line-height: 1; }
.rb-sub   { font-size: 0.62rem; color: var(--gold); font-weight: 700; }
.rb-btn   { margin-top: 0.5rem; font-size: 0.75rem; padding: 0.4rem 0.85rem; }

/* ── Post page ── */
.post { max-width: 800px; margin: 0 auto; padding: clamp(1.5rem, 4vw, 2.5rem) var(--pad); }

.post-header { margin-bottom: 1.5rem; }
.post-meta-top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.post-date { font-size: 0.8rem; color: var(--text-dim); }
.post-title { font-size: clamp(1.8rem, 6vw, 3rem); color: var(--text); line-height: 1; }

.post-hero-img-wrap { margin: 0 calc(var(--pad) * -1) 1.5rem; }
.post-hero-img { width: 100%; max-height: 520px; object-fit: cover; }

.post-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem; }

.post-content {
  font-size: 1.05rem; line-height: 1.75; color: var(--text);
}
.post-content p { margin-bottom: 1.2rem; }
.post-content img {
  width: 100%; border-radius: var(--radius);
  margin: 1.5rem 0;
}
.post-content a { color: var(--gold); text-decoration: underline; }
.post-content h2, .post-content h3 { margin: 2rem 0 0.75rem; }
```

- [ ] **Step 4: Verify homepage and a post page**

```bash
npx @11ty/eleventy --serve
```

- Open `http://localhost:8080` — hero section renders, masonry grid shows all posts
- Open `http://localhost:8080/posts/zamek/` — title, hero image, "Get free instructions" gold button visible
- Open `http://localhost:8080/posts/odysseus/` — no instruction button (only Rebrickable link in content body)

- [ ] **Step 5: Commit**

```bash
git add src/index.njk src/_includes/layout.njk public/styles.css
git commit -m "feat: homepage hero + masonry grid, post detail layout"
```

---

### Task 6: Search — update index generator and client JS

**Files:**
- Modify: `src/search-index.11ty.js`
- Modify: `public/search.js`
- Modify: `src/search.njk`

**Interfaces:**
- Consumes: posts at `src/posts/*.md`
- Produces: `/search-index.json` with entries `{ title, content, url, image, tags }`  — no `lang` field
- Produces: `/search/` page that renders results as masonry tiles

- [ ] **Step 1: Update `src/search-index.11ty.js`** — read from `src/posts/`:

```js
const fs = require("fs");
const matter = require("gray-matter");

module.exports = () => {
  const posts = [];
  const dir = "src/posts";
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (!file.endsWith(".md")) return;
      const raw = fs.readFileSync(`${dir}/${file}`, "utf-8");
      const { data, content } = matter(raw);
      posts.push({
        title: data.title || "",
        content,
        url: `/posts/${file.replace(/\.md$/, "/")}`,
        image: data.image || null,
        tags: data.tags || []
      });
    });
  }
  return JSON.stringify(posts, null, 2);
};

module.exports.data = {
  permalink: "search-index.json"
};
```

- [ ] **Step 2: Update `public/search.js`** — remove language filter, use masonry tile HTML:

```js
fetch('/search-index.json')
  .then(res => res.json())
  .then(docs => {
    const idx = lunr(function () {
      this.ref('url');
      this.field('title', { boost: 10 });
      this.field('content');
      docs.forEach(doc => this.add(doc));
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const output = document.getElementById("search-results");

    if (!query) return;

    document.getElementById("search-query-display").textContent = query;

    const results = idx.search(query);
    if (!results.length) {
      output.innerHTML = '<p class="search-empty">No builds found for that search.</p>';
      return;
    }

    output.innerHTML = '<div class="masonry">' + results.map(result => {
      const doc = docs.find(d => d.url === result.ref);
      if (!doc) return "";
      const img = doc.image
        ? `<img src="${doc.image}" alt="${doc.title}" loading="lazy">`
        : `<div class="tile-no-image"></div>`;
      const tags = (doc.tags || [])
        .filter(t => t !== "post" && t !== "news")
        .map(t => `<span class="tag${t === "moc" ? "" : " neutral"}">${t.toUpperCase()}</span>`)
        .join(" ");
      return `
        <a href="${doc.url}" class="tile" aria-label="${doc.title}">
          ${img}
          <div class="tile-overlay">
            ${tags}
            <span class="tile-title">${doc.title}</span>
          </div>
        </a>`;
    }).join("") + '</div>';
  });
```

- [ ] **Step 3: Update `src/search.njk`**

```njk
---
title: Search — MasterBuilder.pl
layout: base.njk
---

{% block content %}
<div class="search-page">
  <div class="search-header">
    <h1>Search</h1>
    <form class="search-form" action="/search/">
      <input class="search-input" type="text" name="q" placeholder="Search builds…" autofocus
        value="{{ eleventy.env.root }}"
      >
      <button class="btn-primary" type="submit">Search</button>
    </form>
    <p class="search-caption" id="search-query-display"></p>
  </div>
  <div id="search-results"></div>
</div>
<script src="/public/lunr.min.js"></script>
<script src="/public/search.js"></script>
{% endblock %}
```

- [ ] **Step 4: Append search page styles to `public/styles.css`**

```css
/* ── Search page ── */
.search-page { padding: clamp(1.5rem, 4vw, 2.5rem) var(--pad); }
.search-header { margin-bottom: 2rem; }
.search-header h1 { margin-bottom: 1rem; }
.search-form { display: flex; gap: 0.5rem; max-width: 480px; }
.search-input {
  flex: 1; background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
  color: var(--text); font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; padding: 0.55rem 0.9rem;
}
.search-input:focus { outline: none; border-color: var(--gold); }
.search-caption { font-size: 0.82rem; color: var(--text-dim); margin-top: 0.5rem; }
.search-empty { color: var(--text-dim); font-size: 0.9rem; margin-top: 1rem; }
```

- [ ] **Step 5: Verify search works end-to-end**

```bash
npx @11ty/eleventy --serve
```

Open `http://localhost:8080/search/?q=castle` — expect masonry results for the zamek/castle post. Open `http://localhost:8080/search/?q=turtle` — expect the turtle post.

- [ ] **Step 6: Commit**

```bash
git add src/search-index.11ty.js public/search.js src/search.njk public/styles.css
git commit -m "feat: update search for single-language, masonry results"
```

---

### Task 7: Final polish — about page, `.gitignore`, smoke-test full site

**Files:**
- Modify: `src/about.md` (add frontmatter `layout: layout.njk`)
- Modify: `.gitignore` (add `.superpowers/`)
- Modify: `CLAUDE.md` (update commands and structure to reflect new layout)

- [ ] **Step 1: Verify `src/about.md` frontmatter** — open the file and confirm it has:

```yaml
---
title: About
layout: layout.njk
---
```

If `language: en` is still present, remove it. If `layout` is missing, add it.

- [ ] **Step 2: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and add the line:
```
.superpowers/
```

- [ ] **Step 3: Build the full static site and check for errors**

```bash
npx @11ty/eleventy
```

Expected: zero errors, `_site/` contains `index.html`, `posts/*/index.html`, `tags/*/index.html`, `search/index.html`, `search-index.json`.

- [ ] **Step 4: Smoke-test key URLs in the browser**

```bash
npx @11ty/eleventy --serve
```

Check each:
- `http://localhost:8080/` — hero renders, masonry grid visible with photos
- `http://localhost:8080/posts/zamek/` — dark post layout, hero image, gold "Get free instructions" button
- `http://localhost:8080/posts/odysseus/` — renders cleanly with no instruction/rebrickable buttons (neither field in frontmatter)
- `http://localhost:8080/tags/moc/` — masonry grid filtered to MOC-tagged posts
- `http://localhost:8080/search/?q=castle` — returns zamek result
- `http://localhost:8080/search/?q=turtle` — returns turtle result
- Nav: clicking search icon goes to `/search/`, IG/FB icons open correct URLs

- [ ] **Step 5: Update `CLAUDE.md`** — reflect new URL structure and removed Polish:

In the "Content structure" section change:
- `src/en/posts/*.md` / `src/pl/posts/*.md` → `src/posts/*.md`
- URL structure note: posts at `/posts/[slug]/`, tags at `/tags/[slug]/`
- Remove mention of `translations.js` and `selectLang` filter

- [ ] **Step 6: Final commit**

```bash
git add .gitignore src/about.md CLAUDE.md
git commit -m "feat: about page polish, gitignore superpowers, update docs"
```
