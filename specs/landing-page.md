---
type: Specification
title: Landing page
description: The KS-Suite landing page in site/, drawn from site/apps.json with downloads from the GitHub releases API, served by GitHub Pages.
tags: [site, github-pages, landing-page, plan]
---

# Landing page

Status: **built** (2026-11-22), following the recommended choice for each decision below. Pages is turned on by the owner in the repository settings (Source: GitHub Actions).

## Adding an app or restyling
- **Add an app:** put a `ks-suite.json` card in the root of the app's repository, on its default branch (see [The app card](#the-app-card-ks-suitejson)). Within the hour the Pages workflow finds it and the app appears; nothing changes in this repository. Use a new `group` or a new icon only after adding it here.
- **New versions and first releases** need nothing: the page reads every app's newest release from GitHub when it opens, and an app with a published release shows as released.
- **Restyle:** edit `site/theme.css` only. The palette is violet and pink with a gradient on primary buttons and the title, and six app colours (`--hue-0` … `--hue-5`), given to cards in `apps.json` order for the icon and its backdrop. Re-check contrast for any colour pair you change.
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
  icons/            ks-suite.svg (logo and favicon) and avatar.jpg, the owner's GitHub profile picture (a local copy; replace the file to change it); Lucide icons are inlined in app.js
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
Order in the file is the order on the page. `icon` is the name of a Lucide icon inlined in `app.js` (`tv`, `playCircle`, `clapperboard`, `wallet`, `shieldCheck`, `hardDriveDownload`, …); add the icon's paths there to use a new one. `platforms` uses fixed ids, whose labels are in the language files. `tagline` has one text per language. `status` is `released`, `beta` or `coming-soon`; the Pages workflow sets it from the app's releases (see [Collecting the apps](#collecting-the-apps)), so it is only written by hand to keep an app at `beta`. `platformStatus` (optional) gives one platform its own status, `released` or `beta`, for example `{ "windows": "beta" }` on a released app; each key must be in `platforms`. A beta platform of an app that is not itself beta shows as "Windows (Beta)" in the platform list and on its download buttons (key `platform.withStatus` in the language files). `stack` (optional) is a short tech line shown at the foot of the card, not translated.

Grouping and access in `apps.json`:
- `restricted` (optional, `true`): for an app whose repository is private. The card shows a "Private" badge and a lock note, and no download or release links, so visitors never meet a 404. No app sets it today: every repository is public.
- `group` (required): the id of an entry in the top-level `groups` list. Each group has an `id`, a `title` and an optional `note`, both in English and Hindi. The page shows one section per group, in the order of `groups`; an empty group is skipped.

## Views
The page opens on the intro only. The apps and the install notes show when the address ends in `#apps`: the "Show apps" switch, the skip link, or a shared link. "Show apps" is a pill-shaped on/off switch with a round knob (`role="switch"`, `aria-checked`, `aria-controls`; Space or Enter toggles it). Turning it on sets `#apps`; turning it off removes it with `history.pushState`, so Back restores the previous state. Its size and colours are in `theme.css` (`--toggle-*`). `theme-init.js` sets `data-view` on `<html>` before first paint, so there is no flash; `app.js` follows `hashchange`, moves focus to the apps and scrolls to them, and the browser's Back button returns to the intro. Without JavaScript everything is visible.

```json
{
  "owner": "kumasumit",
  "apps": [
    {
      "id": "ks-download-manager",
      "name": "KS Download Manager",
      "group": "desktop",
      "repo": "kumasumit/ks-download-manager",
      "icon": "hardDriveDownload",
      "status": "released",
      "platforms": ["macos", "windows", "chrome"],
      "platformStatus": { "macos": "released", "windows": "beta", "chrome": "released" },
      "stack": "Rust · Tauri",
      "tagline": {
        "en": "Free download manager for images, audio and video, with up to 20× faster downloads.",
        "hi": "इमेज, ऑडियो और वीडियो के लिए मुफ़्त डाउनलोड मैनेजर, 20 गुना तक तेज़ डाउनलोड के साथ।"
      }
    }
  ]
}
```
The page checks each entry on load. An entry with a missing field or an unknown status or platform is left out and reported in the console, so one bad entry never breaks the page. An unknown icon is drawn as `layers` instead, so a new app's card still shows.

## The app card (`ks-suite.json`)
Each app repository describes its own card in `ks-suite.json` at the repository root, on its default branch (`main`, so it describes the released app). It is an `apps.json` entry without `repo` (taken from the repository) and usually without `status`; `id` defaults to the repository name:
```json
{
  "name": "KS Beam",
  "group": "media",
  "icon": "cast",
  "platforms": ["android", "google-tv", "windows", "macos"],
  "platformStatus": { "windows": "beta" },
  "stack": "Kotlin Multiplatform",
  "tagline": { "en": "…", "hi": "…" }
}
```
The `site/apps.json` entries stay as the fallback: a card replaces the fields it gives, and an app without a card keeps its entry.

## Collecting the apps
`.github/scripts/collect-apps.mjs` (Node, no packages) rebuilds `site/apps.json` inside the Pages run, never committed:
1. Lists the public repositories of `kumasumit` (no forks, nothing archived) and reads each one's `ks-suite.json` from its default branch. A repository without the file is not an app.
2. Keeps the entries already in `site/apps.json` in their order and merges each card into its entry (matched by `id` or `repo`); apps found only through a card come after them.
3. Sets each app's `status` from its releases: a published release gives `released`, only pre-releases give `beta`, none gives `coming-soon`. An entry or card that says `beta` stays `beta`.
A GitHub call that fails leaves that part as it was (a warning in the run), so the page never loses its apps. The run uses the workflow's `GITHUB_TOKEN`, so the API rate limit is not a concern.

## Downloads
- One request per app (every status), `GET https://api.github.com/repos/{repo}/releases?per_page=20`, unauthenticated. Drafts are skipped; pre-releases count. Apps release each platform on its own tag ([platform tags](versioning-signing.md#platform-tags-own-version-per-platform)), so each platform's button comes from the newest release that has its file, and the card names every version it shows (`mac-v1.6.0, v1.5.1`). The card's link opens the full release list, because a platform release is not marked latest.
- Platform from the asset file name, first rule that matches, case-insensitive:

| Button | File name |
|---|---|
| macOS Apple silicon | `.dmg` or `.app.tar.gz` containing `aarch64`, `arm64` or `apple-silicon` |
| macOS Intel | `.dmg` or `.app.tar.gz` containing `x64`, `x86_64` or `intel` |
| macOS (universal) | any other `.dmg` |
| Windows | any `.msi`; an `.exe` only if its name has `setup` or `install` or starts with the repository name (so a bundled `ffmpeg.exe` is skipped) |
| Chrome extension | `.zip` or `.crx` containing `chrome` or `extension` |
| Google TV | `.apk` whose name contains `google-tv`, `googletv`, `android-tv` or `-tv.` / `-tv-` (a separate TV build) |
| Android | any other `.apk` (`.aab` ignored) |

- A `coming-soon` app whose request finds a release shows as released with its downloads straight away, without waiting for the hourly run. With no release it shows "Coming soon" and a link to the repository.
  Signature, checksum and update files (`.sig`, `.sha256`, `latest.json`, `.blockmap`) are skipped. One button per platform; if two assets match one platform, the larger one wins (the installer rather than an update patch).
- A button appears only when the release has that file. A TV build names itself (`<app>-v<version>-google-tv.apk`) and gets "Google TV"; any other APK is the phone build and gets "Android". In a TV-only app (`google-tv` without `android`, such as ks-tv-launcher) its one APK is the TV build. A phone APK never doubles as a Google TV button, because a phone interface is unusable with a remote.
- Once the release is known, the card's platform list keeps Android and Google TV only when their APK is there, so `platforms` in a card can list both and the release decides. Which apps build which APK: [Platform folders](platform-folders.md) (an app with a `tv/google-tv` module ships a separate TV APK).
- Each button shows the platform, and the card shows the version tag and the release date (formatted for the language with `Intl`, Latin digits). Size is formatted with `KB` / `MB` symbols.
- A pre-release, or an app with `status: beta`, gets a visible "Beta" or "Pre-release" badge in text, not colour alone.
- Fallback: on any network error, non-200 response (including 403/429 rate limit), a release with no matching assets, or no releases at all, the card shows a single "Download from GitHub Releases" link to `https://github.com/{repo}/releases`. A button is only drawn once its URL and size are known, so a broken or empty button never appears.
- While loading, the card shows a text "Checking for the newest release…" placeholder (no spinner animation when reduced motion is set).
- Results are kept in `sessionStorage` for 10 minutes, to stay well under the 60-requests-per-hour limit.

## Languages
- Text in `site/lang/en.json` and `site/lang/hi.json` in the [suite translation format](https://github.com/kumasumit/ks-utility/blob/main/specs/translation-format.md); Hindi follows the [Hindi style guide](https://github.com/kumasumit/ks-utility/blob/main/specs/hindi-style.md). App taglines live in `apps.json`.
- The [language rule](https://github.com/kumasumit/ks-utility/blob/main/specs/languages.md): follow `navigator.languages` with no choice made, a language dropdown in the header (a native `<select>`, whose list opens vertically) offers Same as system, English and हिंदी; the choice is saved in `localStorage` and wins from then on; an unknown saved value counts as "same as the system". The page sets `<html lang>`.
- Latin digits in both: all numbers and dates go through `Intl` with `numberingSystem: "latn"`.

## Theme and access
- `theme.css` holds every colour, the font stack, the type scale, spacing, radii and motion durations as custom properties, each colour written once as `light-dark(light, dark)`. The page follows the system; a header switch (System, Light, Dark) sets `data-theme` on `<html>`, is remembered in `localStorage` (`ks-suite.theme`), and is applied before first paint by `theme-init.js`, so there is no flash. All text and badge pairs checked for WCAG AA (4.5:1 body, 3:1 large text and focus rings).
- Keyboard: real `<a>` and `<button>` elements, a visible `:focus-visible` ring, a "Skip to apps" link, logical tab order. The theme switch uses `aria-pressed`; the language dropdown is a labelled native `<select>`.
- `prefers-reduced-motion: reduce` turns off all transitions.
- Mobile first: one column under 640 px, buttons at least 44 px tall, no horizontal scroll at 320 px.
- Without JavaScript, a `<noscript>` block lists every app with a link to its Releases page.

## Deploy
`.github/workflows/pages.yml`, on `push` to `main` with `paths: [site/**, .github/workflows/pages.yml, .github/scripts/collect-apps.mjs]`, hourly (`17 * * * *`), plus `workflow_dispatch`. Before the upload, `build` runs the collector; an hourly run compares the result with the live `apps.json` and skips the upload and deploy when nothing changed. GitHub turns hourly runs off after 60 days without activity in the repository; turn them on again in the Actions tab, or run the workflow by hand. Runner `ubuntu-24.04`. Permissions `contents: read`, `pages: write`, `id-token: write`; concurrency group `pages`. Two jobs, as in GitHub's Pages starter workflow: `build` runs `actions/checkout`, `actions/configure-pages` and `actions/upload-pages-artifact` (path `site`); `deploy` (`needs: build`) runs `actions/deploy-pages`. Before the upload, `build` replaces `__VERSION__` in `site/index.html` and `site/app.js` with the short commit id and the run number (an hourly run can redeploy the same commit with a new app list); `app.js` also requests `apps.json` and the language files with it,, so the CSS and JavaScript links (`style.css?v=__VERSION__`) change with every deploy and browsers never mix a new page with cached old files (GitHub Pages lets browsers keep files for 10 minutes). Locally the placeholder is harmless. Each action is pinned to a full commit SHA with the version in a comment. (A single job failed when the deploy step looked for the artifact a fraction of a second after the upload, before GitHub listed it.) The SHAs are looked up from each action's release tag when building.

## Repository page
The repository's Website field (the About box) points to `https://kumasumit.github.io/KS-Suite/`, GitHub lists the `github-pages` deployment, and site releases are tagged `vMAJOR.MINOR.PATCH` with a GitHub release (`v1.0.0` is the first).

## README
A short section at the top: what KS-Suite is, a link to the page (`https://kumasumit.github.io/KS-Suite/`) to download the apps, then the existing developer material below. 

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
