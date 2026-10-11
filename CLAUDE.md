# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start dev server with live reload
npx @11ty/eleventy --serve

# Build static site to _site/
npx @11ty/eleventy
```

No test suite is configured. Verification = `npx @11ty/eleventy` builds without errors.

## Architecture

This is an English-only static site showcasing custom LEGO MOC (My Own Creation) builds, built with [Eleventy (11ty)](https://www.11ty.dev/) 3.x and Nunjucks. It deploys automatically to GitHub Pages on pushes to `main`.

Dark Studio design: warm charcoal background (`#1e1c19`), antique gold accents (`#c9a84c`), Bebas Neue headlines, DM Sans body, full-width masonry photo grid.

### Content structure

All source content lives in `src/`. Posts live in a single directory (English only):

- `src/posts/*.md` — posts at `/posts/[slug]/`

Post frontmatter schema: `title`, `date`, `layout: layout.njk`, `tags`, `image`, `description`, and optionally `rebrickable` (Rebrickable URL) and `instruction` (free instruction PDF URL).

The `image` field is automatically rendered as a full-width hero image at the top of the post by `layout.njk`. Never add it again as an inline `<img>` in the post body — that would duplicate it.

Posts tagged `moc` are MOC builds. System tags excluded from display: `post`, `news`, `moc`.

### Eleventy configuration (`.eleventy.js`)

- **`posts` collection** — glob `src/posts/*.md`, sorted by date descending
- **`tagList` collection** — array of `{ tag, slug }` objects, title-cased, excluding system tags
- **Custom filters**: `selectTag(arr, tag)`, `sortByDate(arr)`, `readableDate(dateObj)`, `date(dateObj, format)`
- Input dir: `src/`, output dir: `_site/`, template engine: Nunjucks

### Templates

- `src/_includes/base.njk` — HTML shell with Google Fonts, sticky nav (logo + search + Instagram + Facebook), support strip (Buy Me a Coffee + Rebrickable), footer
- `src/_includes/layout.njk` — extends base, renders post header (tags + date), hero image, action buttons (instruction/rebrickable), and content
- `src/_includes/post-tiles.njk` — reusable macro `post_tiles(posts)` rendering a `.masonry` CSS Grid; first post gets `.tall`, 4th gets `.wide`

### Pages

- `src/index.njk` — homepage: hero section + masonry grid of all posts
- `src/search.njk` — search page using Lunr.js
- `src/tags.njk` — paginated tag pages at `/tags/[slug]/`
- `src/about.md` — about page using `layout: layout.njk`
- `src/sitemap.njk` — XML sitemap at `/sitemap.xml`

### Global data (`src/_data/`)

- `site.json` — site URL, Instagram, Facebook, and Rebrickable profile URLs

### Search

`src/search-index.11ty.js` generates `search-index.json` at build time (reads `src/posts/*.md` with `gray-matter`). Each entry: `{ title, content, url, image, tags }`. Client-side search uses Lunr.js (`public/lunr.min.js`) and `public/search.js`.

### Tag pages

`src/tags.njk` paginates over `collections.tagList` to generate one page per tag at `/tags/[slug]/`.

### CSS

`public/styles.css` — single file with CSS custom properties tokens, Bebas Neue/DM Sans typography, button variants (`.btn-primary`, `.btn-ghost`, `.btn-coffee`, `.btn-rebrickable`), tag chips (`.tag`, `.tag.blue`, `.tag.neutral`), social icons (`.social-icon.ig/.fb`), sticky nav (`.site-nav`), masonry grid (`.masonry`, `.tile`, `.tile.tall`, `.tile.wide`), hero section, post page, and search page styles.
