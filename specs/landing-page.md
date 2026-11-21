---
type: Specification
title: Landing page
description: The KS-Suite landing page in site/, drawn from site/apps.json with downloads from the GitHub releases API, served by GitHub Pages.
tags: [site, github-pages, landing-page, plan]
---

# Landing page

Status: **built** (2026-11-22), following the recommended choice for each decision below. Pages is turned on by the owner in the repository settings (Source: GitHub Actions).

## Adding an app or restyling
- **Add an app:** add an entry to `site/apps.json` and its icon to `site/icons/`. Nothing else changes. Use `"status": "coming-soon"` until it has a public release.
- **Restyle:** edit `site/theme.css` only. Re-check contrast for any colour pair you change.
- **Change interface text:** edit `site/lang/en.json` and `site/lang/hi.json`, then run `node ks-utility/typescript/tools/lang.mjs check site/lang` from the workspace (Node 23.6+, nothing installed).

One page that presents the suite and every app. Each app's card leads to its downloads. Restyling means editing one theme file; adding an app means adding one entry to `site/apps.json`.

## Files
```
site/
  index.html        page shell: header, hero, empty app grid, footer, <noscript> link list
  theme.css         the only place for colours, type, spacing, radii, motion (CSS custom properties)
  style.css         layout and components; uses theme.css variables only, no literal colours
  theme-init.js     applies the saved theme before the page is drawn
  app.js            loads apps.json and lang/*.json, draws cards, fetches releases
  apps.json         the app list (the page is drawn entirely from it)
  lang/en.json      interface text, suite translation format
  lang/hi.json
  icons/            our own app icons (SVG) and avatar.jpg, the owner's GitHub profile picture (a local copy; replace the file to change it); Lucide icons are inlined in app.js
.github/workflows/pages.yml
```
No framework, build step or package install. Everything is served from the Pages origin: system font stack, no remote fonts, scripts, images or analytics. A `Content-Security-Policy` meta tag allows only `'self'` plus `connect-src https://api.github.com`.

## Layout (text sketch)
```
┌──────────────────────────────────────────────────────────┐
│ [KS logo] KS-Suite      [◐ ☀ ☾]  [🌐 English ▾]       │  header: theme switch, language dropdown
├──────────────────────────────────────────────────────────┤
│  Free, private apps for the TV, the desktop and phone.   │  hero: tagline + 3 short points
│  · Private by default · No ads or tracking · Open source │  (private / lean / one standard)
├──────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐ ┌───────────────────────┐      │  app grid: 1 column on a phone,
│ │ [icon] ks-download-   │ │ [icon] ks-tv-launcher │      │  2 on tablet, 3 on desktop
│ │ manager      [BETA]   │ │          [RELEASED]   │      │
│ │ Free download manager │ │ Ad-free TV launcher…  │      │  tagline in the page language
│ │ ▢ Windows ▢ macOS     │ │ ▢ Google TV           │      │  platform chips
│ │ v0.5.0 · 3 Dec 2026   │ │ v0.7.3 · 2 Nov 2026   │      │  newest release (pre-release flagged)
│ │ [↓ macOS Apple silicon│ │ [↓ Android  · 18 MB]  │      │  one button per asset platform,
│ │    · 12 MB]           │ │                       │      │  with size
│ │ [↓ Windows · 10 MB]   │ │ Source on GitHub →    │      │
│ │ All releases →        │ │                       │      │
│ └───────────────────────┘ └───────────────────────┘      │
│ ┌───────────────────────┐                                │
│ │ [icon] ks-vault       │  coming soon: no download      │
│ │        [COMING SOON]  │  button, only "Source on       │
│ │ Offline secure vault  │  GitHub →"                     │
│ └───────────────────────┘                                │
├──────────────────────────────────────────────────────────┤
│ MIT licence · Source · No analytics, no cookies          │  footer
└──────────────────────────────────────────────────────────┘
```

## apps.json
Order in the file is the order on the page. `icon` is a file in `site/icons/`. `platforms` uses fixed ids, whose labels are in the language files. `tagline` has one text per language. `status` is `released`, `beta` or `coming-soon`. `stack` (optional) is a short tech line shown at the foot of the card, not translated.

Customizing a card in `apps.json`:
- `group` (required): the id of an entry in the top-level `groups` list. Each group has an `id`, a `title` and an optional `note`, both in English and Hindi. The page shows one section per group, in the order of `groups`; an empty group is skipped.
- `accent` (optional, `#rrggbb`): the app's colour, used for the strip along the card's top edge, the icon backdrop, the highlight ticks and the hover border. Decoration only; text never sits on it.
- `featured` (optional, `true`): the card spans the full row with a soft tint of its accent.
- `highlights` (optional): a short list per language, shown as ticked points.
- How strong the tints are, the strip height and the hover lift are in `theme.css` (`--icon-tint`, `--featured-tint`, `--card-strip`, `--card-lift`).

## Views
The page opens on the intro only. The apps and the install notes show when the address ends in `#apps`: the "See the apps" button, the skip link, or a shared link. `theme-init.js` sets `data-view` on `<html>` before first paint, so there is no flash; `app.js` follows `hashchange`, moves focus to the apps and scrolls to them, and the browser's Back button returns to the intro. Without JavaScript everything is visible.

```json
{
  "owner": "kumarsumit17",
  "apps": [
    {
      "id": "ks-download-manager",
      "name": "KS Download Manager",
      "group": "desktop",
      "repo": "kumarsumit17/ks-download-manager",
      "icon": "ks-download-manager.svg",
      "accent": "#0f8a5f",
      "status": "coming-soon",
      "platforms": ["windows", "macos"],
      "stack": "Rust · Tauri",
      "tagline": {
        "en": "Free download manager for images, audio and video, with up to 20× faster downloads.",
        "hi": "इमेज, ऑडियो और वीडियो के लिए मुफ़्त डाउनलोड मैनेजर, 20 गुना तक तेज़ डाउनलोड के साथ।"
      }
    }
  ]
}
```
The page checks each entry on load. An entry with a missing field or an unknown status or platform is left out and reported in the console, so one bad entry never breaks the page.

## Downloads
- `status: coming-soon`: no API call, no download buttons. The card shows "Coming soon" and a link to the repository.
- Otherwise: one request per app, `GET https://api.github.com/repos/{repo}/releases?per_page=5`, unauthenticated. The newest entry that is not a draft wins, pre-releases included.
- Platform from the asset file name, first rule that matches, case-insensitive:

| Button | File name |
|---|---|
| macOS Apple silicon | `.dmg` or `.app.tar.gz` containing `aarch64`, `arm64` or `apple-silicon` |
| macOS Intel | `.dmg` or `.app.tar.gz` containing `x64`, `x86_64` or `intel` |
| macOS (universal) | any other `.dmg` |
| Windows | any `.msi`; an `.exe` only if its name has `setup` or `install` or starts with the repository name (so a bundled `ffmpeg.exe` is skipped) |
| Chrome extension | `.zip` or `.crx` containing `chrome` or `extension` |
| Android | `.apk` (`.aab` ignored) |

  Signature, checksum and update files (`.sig`, `.sha256`, `latest.json`, `.blockmap`) are skipped. One button per platform; if two assets match one platform, the larger one wins (the installer rather than an update patch).
- Each button shows the platform, and the card shows the version tag and the release date (formatted for the language with `Intl`, Latin digits). Size is formatted with `KB` / `MB` symbols.
- A pre-release, or an app with `status: beta`, gets a visible "Beta" or "Pre-release" badge in text, not colour alone.
- Fallback: on any network error, non-200 response (including 403/429 rate limit), a release with no matching assets, or no releases at all, the card shows a single "Download from GitHub Releases" link to `https://github.com/{repo}/releases`. A button is only drawn once its URL and size are known, so a broken or empty button never appears.
- While loading, the card shows a text "Checking for the newest release…" placeholder (no spinner animation when reduced motion is set).
- Results are kept in `sessionStorage` for 10 minutes, to stay well under the 60-requests-per-hour limit.

## Languages
- Text in `site/lang/en.json` and `site/lang/hi.json` in the [suite translation format](https://github.com/kumarsumit17/ks-utility/blob/main/specs/translation-format.md); Hindi follows the [Hindi style guide](https://github.com/kumarsumit17/ks-utility/blob/main/specs/hindi-style.md). App taglines live in `apps.json`.
- The [language rule](https://github.com/kumarsumit17/ks-utility/blob/main/specs/languages.md): follow `navigator.languages` with no choice made, a language dropdown in the header (a native `<select>`, whose list opens vertically) offers Same as system, English and हिंदी; the choice is saved in `localStorage` and wins from then on; an unknown saved value counts as "same as the system". The page sets `<html lang>`.
- Latin digits in both: all numbers and dates go through `Intl` with `numberingSystem: "latn"`.

## Theme and access
- `theme.css` holds every colour, the font stack, the type scale, spacing, radii and motion durations as custom properties, each colour written once as `light-dark(light, dark)`. The page follows the system; a header switch (System, Light, Dark) sets `data-theme` on `<html>`, is remembered in `localStorage` (`ks-suite.theme`), and is applied before first paint by `theme-init.js`, so there is no flash. All text and badge pairs checked for WCAG AA (4.5:1 body, 3:1 large text and focus rings).
- Keyboard: real `<a>` and `<button>` elements, a visible `:focus-visible` ring, a "Skip to apps" link, logical tab order. The theme switch uses `aria-pressed`; the language dropdown is a labelled native `<select>`.
- `prefers-reduced-motion: reduce` turns off all transitions.
- Mobile first: one column under 640 px, buttons at least 44 px tall, no horizontal scroll at 320 px.
- Without JavaScript, a `<noscript>` block lists every app with a link to its Releases page.

## Deploy
`.github/workflows/pages.yml`, on `push` to `main` with `paths: [site/**, .github/workflows/pages.yml]`, plus `workflow_dispatch`. Runner `ubuntu-24.04`. Permissions `contents: read`, `pages: write`, `id-token: write`; concurrency group `pages`. Steps, each pinned to a full commit SHA with the version in a comment: `actions/checkout`, `actions/configure-pages`, `actions/upload-pages-artifact` (path `site`), `actions/deploy-pages`. The SHAs are looked up from each action's release tag when building.

## README
A short section at the top: what KS-Suite is, a link to the page (`https://kumarsumit17.github.io/KS-Suite/`) to download the apps, then the existing developer material below. 

## Checks before committing
Open `site/` with a local static server; test both languages, light and dark, keyboard only, reduced motion, 320 px width, API failure (offline) and a coming-soon card; run the ks-utility language-file check on `site/lang/` if it can be run without installing packages (see decision 1).

## Decisions (resolved 2026-11-22, recommended options)
1. **ks-utility in a page with no build step.** The rules say shared code comes from `ks-utility` pinned to a tag and is never copied, but the site cannot compile its TypeScript or install packages. Options:
   a. *(recommended)* Implement the small language rule and `{placeholder}` look-up directly in `app.js` (about 30 lines), keep the text in the suite format, and add a ks-utility git submodule only if you want the language-file check run in CI.
   b. Add a plain-JS build of the translator to a ks-utility release, and serve that file from a pinned copy. This is a change to ks-utility first.
2. **Shared catalogue.** Use `common.*` keys from ks-utility's `lang/common/` (needs option b or a pinned copy), or keep all page text in `site/lang/` (recommended with option a).
3. **ks-download-manager status.** `coming-soon` while its only release (`v0.1.2`) is a draft, which the public API does not show. Switch to `beta` when that release is published.
4. **Hero text.** The README's three points (private, lean, open source to one standard).
5. **Icons.** Simple SVG icons (white glyph on a colour gradient) in `site/icons/`; replace them with real artwork any time.
6. **Hindi review.** New Hindi terms (for example "pre-release", "coming soon") will be marked owner review in `site/lang/hi.json` notes and in this spec until you approve them.
