// KS-Suite landing page. Draws every app card from apps.json and fills the download
// buttons from the GitHub releases API. Plain JavaScript, no build step, no libraries.
"use strict";

(() => {
  const STORAGE_LANGUAGE = "ks-suite.language";
  const STORAGE_THEME = "ks-suite.theme"; // also read by theme-init.js
  const THEMES = ["light", "dark"];
  const CACHE_PREFIX = "ks-suite.release.v2.";
  const CACHE_MS = 10 * 60 * 1000;
  const FETCH_TIMEOUT_MS = 8000;
  const LANGUAGES = ["en", "hi"];
  const STATUSES = ["released", "beta", "coming-soon"];

  // Lucide icons (ISC licence), inlined so nothing is loaded from another site.
  const LUCIDE = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    tv: '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    playCircle: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    clapperboard: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    cast: '<path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><path d="M2 12a9 9 0 0 1 8 8"/><path d="M2 16a5 5 0 0 1 4 4"/><line x1="2" x2="2.01" y1="20" y2="20"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    shieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    hardDriveDownload: '<path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    folderGit: '<path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle cx="13" cy="12" r="2"/><path d="M18 19c-2.8 0-5-2.2-5-5v8"/><circle cx="20" cy="19" r="2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  };

  // Platform ids allowed in apps.json: their language key and icon.
  const PLATFORMS = {
    "google-tv": { key: "platform.googleTv", icon: "tv" },
    android: { key: "platform.android", icon: "smartphone" },
    ios: { key: "platform.ios", icon: "smartphone" },
    windows: { key: "platform.windows", icon: "monitor" },
    macos: { key: "platform.macos", icon: "laptop" },
    chrome: { key: "platform.chrome", icon: "plug" },
  };

  // Download kinds found in release file names, in button order.
  const KINDS = [
    { id: "macArm", key: "download.macArm", platform: "macos" },
    { id: "macIntel", key: "download.macIntel", platform: "macos" },
    { id: "mac", key: "download.mac", platform: "macos" },
    { id: "windows", key: "download.windows", platform: "windows" },
    { id: "chrome", key: "download.chrome", platform: "chrome" },
    { id: "android", key: "download.android", platform: "android" },
    { id: "googleTv", key: "download.googleTv", platform: "google-tv" },
  ];

  // Statuses one platform of a released or beta app can have (apps.json "platformStatus").
  const PLATFORM_STATUSES = ["released", "beta"];

  const state = { groups: [], apps: [], text: {}, language: "en", releases: new Map() };

  // ---------- Language (ks-utility's language rule) ----------

  function parseChoice(saved) {
    return LANGUAGES.includes(saved) ? saved : "system";
  }

  function resolveLanguage(choice, preferred) {
    if (choice !== "system") return choice;
    for (const tag of preferred || []) {
      const primary = String(tag).toLowerCase().split("-")[0];
      if (LANGUAGES.includes(primary)) return primary;
    }
    return "en";
  }

  function savedChoice() {
    try { return parseChoice(localStorage.getItem(STORAGE_LANGUAGE)); } catch { return "system"; }
  }

  function saveChoice(choice) {
    try {
      if (choice === "system") localStorage.removeItem(STORAGE_LANGUAGE);
      else localStorage.setItem(STORAGE_LANGUAGE, choice);
    } catch { /* storage blocked: the choice lasts for this visit only */ }
  }

  // ---------- Theme (same shape as the language rule: system, or a remembered choice) ----------

  function savedTheme() {
    try { const v = localStorage.getItem(STORAGE_THEME); return THEMES.includes(v) ? v : "system"; } catch { return "system"; }
  }

  function applyTheme(choice) {
    try {
      if (choice === "system") localStorage.removeItem(STORAGE_THEME);
      else localStorage.setItem(STORAGE_THEME, choice);
    } catch { /* storage blocked: the choice lasts for this visit only */ }
    if (choice === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choice;
  }

  function locale() {
    return state.language === "hi" ? "hi-IN-u-nu-latn" : "en-GB-u-nu-latn";
  }

  function t(key, params) {
    const table = state.text[state.language] || {};
    let text = table[key] ?? state.text.en?.[key] ?? key;
    if (params) text = text.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (m, name) => (name in params ? String(params[name]) : m));
    return text;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short", year: "numeric" }).format(d);
  }

  function formatSize(bytes) {
    const mb = bytes / (1024 * 1024);
    const nf = (digits) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits });
    if (mb >= 1) return `${nf(mb >= 100 ? 0 : 1).format(mb)} MB`;
    return `${nf(0).format(Math.max(1, Math.round(bytes / 1024)))} KB`;
  }

  // ---------- Small DOM helpers (text is always set with textContent) ----------

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else node.setAttribute(k, v);
    }
    for (const c of children) if (c != null) node.append(c);
    return node;
  }

  function icon(name) {
    const span = document.createElement("span");
    span.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${LUCIDE[name]}</svg>`;
    return span.firstChild;
  }

  // ---------- apps.json ----------

  function validGroup(g) {
    return g && typeof g.id === "string" && /^[a-z0-9-]+$/.test(g.id) &&
      LANGUAGES.every((l) => typeof g.title?.[l] === "string" && g.title[l] && (g.note == null || typeof g.note[l] === "string"));
  }

  function validApp(a) {
    const problems = [];
    if (!a || typeof a !== "object") return ["not an object"];
    if (typeof a.id !== "string" || !/^[a-z0-9-]+$/.test(a.id)) problems.push("id");
    if (typeof a.name !== "string" || !a.name) problems.push("name");
    if (typeof a.repo !== "string" || !/^[\w.-]+\/[\w.-]+$/.test(a.repo)) problems.push("repo");
    if (typeof a.icon !== "string") problems.push("icon");
    else if (!(a.icon in LUCIDE)) {
      // A new app's card may name an icon this page does not have yet: draw a generic one.
      console.warn(`apps.json entry ${a.id}: unknown icon "${a.icon}", using "layers".`);
      a.icon = "layers";
    }
    if (a.restricted != null && typeof a.restricted !== "boolean") problems.push("restricted");
    if (!STATUSES.includes(a.status)) problems.push("status");
    if (!Array.isArray(a.platforms) || !a.platforms.length || !a.platforms.every((p) => p in PLATFORMS)) problems.push("platforms");
    if (a.platformStatus != null && (typeof a.platformStatus !== "object" ||
      !Object.entries(a.platformStatus).every(([p, s]) => a.platforms?.includes(p) && PLATFORM_STATUSES.includes(s)))) problems.push("platformStatus");
    if (a.stack != null && typeof a.stack !== "string") problems.push("stack");
    if (!state.groups.some((g) => g.id === a.group)) problems.push("group");
    if (!a.tagline || !LANGUAGES.every((l) => typeof a.tagline[l] === "string" && a.tagline[l])) problems.push("tagline");
    return problems;
  }

  // ---------- Releases ----------

  function kindOf(fileName, repoName) {
    const n = fileName.toLowerCase();
    if (/\.(sig|asc|sha256|sha512|blockmap|txt|json|yml)$/.test(n) || /sha256sums|checksums/.test(n)) return null;
    if (/\.dmg$|\.app\.tar\.gz$/.test(n)) {
      if (/aarch64|arm64|apple-silicon/.test(n)) return "macArm";
      if (/x86_64|x64|intel/.test(n)) return "macIntel";
      return "mac";
    }
    if (/\.msi$/.test(n)) return "windows";
    // An .exe counts only as an installer or the app itself, not a bundled tool (ffmpeg.exe).
    if (/\.exe$/.test(n)) return /setup|install/.test(n) || n.startsWith(repoName) ? "windows" : null;
    if (/\.(zip|crx)$/.test(n) && /chrome|extension/.test(n)) return "chrome";
    // A TV-only build names itself (app-google-tv.apk, app-tv.apk); any other APK is the phone one.
    if (/\.apk$/.test(n)) return /google-?tv|android-?tv|[-_.]tv[-_.]/.test(n) ? "googleTv" : "android";
    return null;
  }

  // Apps release each platform on its own tag (mac-v1.6.0, android-v1.5.2; specs/versioning-signing.md),
  // so one release may hold one platform only. Releases are taken highest version first (the
  // part after any platform prefix; GitHub's list order is not version order), and each
  // download comes from the first release that has that platform's file. Each download keeps
  // its release's tag and date, so the card names exactly the versions it shows.
  function versionOf(tag) {
    const m = /^(?:[a-z-]+-)?v?(\d+)\.(\d+)\.(\d+)$/.exec(String(tag || ""));
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [-1, -1, -1];
  }
  function newerFirst(a, b) {
    const x = versionOf(a.tag_name), y = versionOf(b.tag_name);
    for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i];
    return String(b.published_at || b.created_at || "").localeCompare(String(a.published_at || a.created_at || ""));
  }
  function pickRelease(list, repo) {
    const releases = (Array.isArray(list) ? list : []).filter((r) => r && !r.draft).sort(newerFirst);
    const repoName = repo.split("/")[1].toLowerCase();
    const best = {};
    for (const release of releases) {
      const here = {};
      for (const a of release.assets || []) {
        if (typeof a.name !== "string" || typeof a.browser_download_url !== "string") continue;
        if (!a.browser_download_url.startsWith("https://github.com/")) continue;
        if (!(a.size > 0)) continue;
        const kind = kindOf(a.name, repoName);
        if (kind && !best[kind] && (!here[kind] || a.size > here[kind].size)) here[kind] = { url: a.browser_download_url, size: a.size };
      }
      const tag = String(release.tag_name || release.name || "");
      const date = release.published_at || release.created_at || "";
      for (const [kind, d] of Object.entries(here)) best[kind] = { ...d, tag, date, prerelease: Boolean(release.prerelease) };
    }
    const downloads = KINDS.filter((k) => best[k.id]).map((k) => ({ kind: k.id, ...best[k.id] }));
    return downloads.length ? { downloads } : null;
  }

  // The versions a card shows (only those of its shown downloads), newest first, with the newest date.
  function shownRelease(app, release) {
    const shown = downloadsFor(app, release);
    const tags = [];
    let date = "", prerelease = false;
    for (const d of shown) {
      if (!tags.includes(d.tag)) tags.push(d.tag);
      if (d.date > date) { date = d.date; prerelease = d.prerelease; }
    }
    tags.sort((a, b) => newerFirst({ tag_name: a }, { tag_name: b }));
    return { version: tags.join(", "), date, prerelease };
  }

  async function fetchRelease(repo) {
    const cacheKey = CACHE_PREFIX + repo;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < CACHE_MS) return cached.release;
    } catch { /* ignore a broken cache entry */ }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=20`, {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
        referrerPolicy: "no-referrer",
        credentials: "omit",
      });
      if (!res.ok) return null; // includes 403 and 429 rate limits: the card falls back
      const release = pickRelease(await res.json(), repo);
      try { sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), release })); } catch { /* full or blocked */ }
      return release;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------- Drawing ----------

  function badge(kind, key) {
    return el("span", { class: `badge badge-${kind}` }, t(key));
  }

  function statusKey(status) {
    return { released: "status.released", beta: "status.beta", "coming-soon": "status.comingSoon" }[status];
  }

  // A platform's label, with "(Beta)" when that platform is in beta but the app is not.
  function withPlatformStatus(app, platform, label) {
    const status = app.platformStatus?.[platform];
    return status === "beta" && app.status !== "beta" ? t("platform.withStatus", { platform: label, status: t("status.beta") }) : label;
  }

  function releasesUrl(app) {
    return `https://github.com/${app.repo}/releases`;
  }

  // A button only for an APK the release really has. A TV build names itself
  // (…-google-tv.apk) and gets "Google TV"; any other APK is the phone build and gets
  // "Android", except in a TV-only app (no "android" platform), where it is the TV build.
  // A phone APK never doubles as a Google TV button: a phone interface is unusable with a remote.
  function downloadsFor(app, release) {
    const tvOnly = app.platforms.includes("google-tv") && !app.platforms.includes("android");
    const list = release.downloads.map((d) =>
      d.kind === "android" && tvOnly && !release.downloads.some((x) => x.kind === "googleTv") ? { ...d, kind: "googleTv" } : d);
    const order = (d) => KINDS.findIndex((k) => k.id === d.kind);
    return list.filter((d) => d.kind !== "android" || !tvOnly).sort((a, b) => order(a) - order(b));
  }

  // The card lists its platforms; once its release is known, Android and Google TV are
  // listed only when the release has their APK, so the card never promises a missing build.
  function shownPlatforms(app) {
    const release = state.releases.get(app.id);
    if (!release) return app.platforms;
    const kinds = new Set(downloadsFor(app, release).map((d) => d.kind));
    return app.platforms.filter((p) => (p !== "android" || kinds.has("android")) && (p !== "google-tv" || kinds.has("googleTv")));
  }

  // The right side of the card's footer: download buttons, or a link when there are none.
  function actions(app) {
    const box = el("div", { class: "actions", "aria-live": "polite" });
    const source = () => el("a", { class: "btn btn-outline btn-small", href: `https://github.com/${app.repo}` }, icon("code"), el("span", null, t("link.source")));
    if (app.restricted) {
      box.append(el("span", { class: "lock-note" }, icon("lock"), el("span", null, t("access.private"))));
      return box;
    }
    if (statusOf(app) === "coming-soon") { box.append(source()); return box; }
    if (!state.releases.has(app.id)) { box.append(el("span", { class: "muted" }, t("release.checking"))); return box; }
    const release = state.releases.get(app.id);
    if (!release) {
      box.append(el("a", { class: "btn btn-outline btn-small", href: releasesUrl(app) }, el("span", null, t("release.fallback")), icon("arrowUpRight")));
      return box;
    }
    for (const d of downloadsFor(app, release)) {
      const kind = KINDS.find((k) => k.id === d.kind);
      const platform = withPlatformStatus(app, kind.platform, t(kind.key));
      const size = formatSize(d.size);
      box.append(el("a", { class: "btn btn-small", href: d.url, "aria-label": t("download.button", { platform, size }) },
        icon("download"), el("span", null, platform), el("span", { class: "size" }, size)));
    }
    // Platform releases are not marked latest, so the link opens the full list.
    box.append(el("a", { class: "btn btn-outline btn-small", href: releasesUrl(app) }, el("span", null, t("release.all")), icon("arrowUpRight")));
    return box;
  }

  // apps.json says "coming-soon" until the hourly collector sees a release; a release
  // found here in the meantime shows the app as released straight away.
  function statusOf(app) {
    return app.status === "coming-soon" && state.releases.get(app.id) ? "released" : app.status;
  }

  function card(app) {
    const release = state.releases.get(app.id);
    const status = statusOf(app);
    const badges = el("span", { class: "badges" },
      app.restricted ? badge("beta", "access.privateBadge") : badge(status, statusKey(status)));
    if (!app.restricted && release && shownRelease(app, release).prerelease && status !== "beta") badges.append(badge("prerelease", "status.prerelease"));

    const platforms = el("span", { class: "platform-pill" },
      el("span", { class: "visually-hidden" }, `${t("platforms.label")}: `),
      shownPlatforms(app).map((p) => withPlatformStatus(app, p, t(PLATFORMS[p].key))).join(" · "));

    const titleId = `app-${app.id}`;
    const head = el("div", { class: "card-head" },
      el("div", { class: "card-title" },
        el("span", { class: "icon-box" }, icon(app.icon)),
        el("div", null,
          el("div", { class: "name-row" }, el("h4", { id: titleId }, app.name), badges),
          el("a", { class: "repo-id", href: `https://github.com/${app.repo}` }, app.id))),
      platforms);

    const meta = el("p", { class: "card-meta" });
    if (app.stack) meta.append(el("span", null, app.stack));
    if (release) {
      const shown = shownRelease(app, release);
      const date = formatDate(shown.date);
      meta.append(el("span", null, date ? t("release.info", { version: shown.version, date }) : shown.version));
    }

    const hue = `hue-${state.apps.indexOf(app) % 6}`; // one colour per app, in apps.json order
    return el("li", { "data-app": app.id, class: hue },
      el("article", { class: "card", "aria-labelledby": titleId },
        head,
        el("p", { class: "tagline", lang: state.language }, app.tagline[state.language]),
        el("div", { class: "card-foot" }, meta, actions(app))));
  }

  function drawStatic() {
    const root = document.documentElement;
    root.lang = state.language;
    document.title = t("page.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("page.description"));
    for (const node of document.querySelectorAll("[data-t]")) node.textContent = t(node.dataset.t);
    for (const node of document.querySelectorAll("[data-t-alt]")) node.setAttribute("alt", t(node.dataset.tAlt));
    for (const node of document.querySelectorAll("[data-t-label]")) node.setAttribute("aria-label", t(node.dataset.tLabel));
    const choice = savedChoice();
    const langSelect = document.getElementById("lang-select");
    if (langSelect) langSelect.value = choice;
    const theme = savedTheme();
    for (const b of document.querySelectorAll("[data-theme-choice]")) b.setAttribute("aria-pressed", String(b.dataset.themeChoice === theme));
  }

  // One section per group, in the order of "groups" in apps.json; empty groups are skipped.
  function drawApps() {
    const sections = state.groups.map((g) => {
      const apps = state.apps.filter((a) => a.group === g.id);
      if (!apps.length) return null;
      const headingId = `group-${g.id}`;
      return el("section", { class: "group", "aria-labelledby": headingId },
        el("div", { class: "group-head" },
          el("h3", { id: headingId }, g.title[state.language]),
          g.note ? el("p", null, g.note[state.language]) : null),
        el("ul", { class: "grid" }, ...apps.map(card)));
    }).filter(Boolean);
    document.getElementById("groups").replaceChildren(...sections);
  }

  function draw() {
    drawStatic();
    drawApps();
  }

  // ---------- View: the apps show only at #apps ----------

  function applyView(moveFocus) {
    const showApps = location.hash === "#apps";
    document.documentElement.dataset.view = showApps ? "apps" : "home";
    // "Show apps" is an on/off switch: on while the apps are showing.
    document.getElementById("see-apps")?.setAttribute("aria-checked", String(showApps));
    if (showApps && moveFocus) {
      const section = document.getElementById("apps");
      section?.focus({ preventScroll: true });
      section?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }

  // ---------- Start ----------

  // The Pages workflow replaces __VERSION__ with the commit id. A page cached from an
  // earlier deploy then asks for that deploy's data files, never newer ones it cannot read.
  const DATA_VERSION = "__VERSION__";

  async function loadJson(path) {
    const res = await fetch(`${path}?v=${DATA_VERSION}`);
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.json();
  }

  async function start() {
    applyView(false);
    window.addEventListener("hashchange", () => applyView(true));
    // The switch adds #apps to the address (hashchange then shows the apps) or takes it
    // away again; either way Back returns to the previous state.
    document.getElementById("see-apps")?.addEventListener("click", () => {
      if (location.hash === "#apps") {
        history.pushState(null, "", location.pathname + location.search);
        applyView(false);
      } else {
        location.hash = "apps";
      }
    });
    state.language = resolveLanguage(savedChoice(), navigator.languages);

    document.getElementById("lang-select")?.addEventListener("change", (e) => {
      const choice = parseChoice(e.target.value);
      saveChoice(choice);
      state.language = resolveLanguage(choice, navigator.languages);
      draw();
    });

    // Static icons in the HTML: <span data-icon="name"> gets the Lucide icon of that name.
    for (const node of document.querySelectorAll("[data-icon]")) {
      if (LUCIDE[node.dataset.icon]) node.replaceChildren(icon(node.dataset.icon));
    }

    for (const b of document.querySelectorAll("[data-theme-choice]")) {
      b.addEventListener("click", () => {
        applyTheme(THEMES.includes(b.dataset.themeChoice) ? b.dataset.themeChoice : "system");
        drawStatic();
      });
    }

    let data;
    try {
      const [apps, en, hi] = await Promise.all([loadJson("apps.json"), loadJson("lang/en.json"), loadJson("lang/hi.json")]);
      data = apps;
      state.text = { en, hi };
    } catch (err) {
      console.error("KS-Suite page: could not load its data files.", err);
      document.getElementById("groups").replaceChildren(
        el("p", null, el("a", { href: "https://github.com/kumasumit/ks-suite#readme" }, "KS-Suite on GitHub")));
      return;
    }

    state.groups = (Array.isArray(data?.groups) ? data.groups : []).filter((g, i) => {
      if (!validGroup(g)) console.warn(`apps.json group ${i} (${g?.id ?? "?"}) left out: it needs an id and a title in English and Hindi.`);
      return validGroup(g);
    });
    state.apps = (Array.isArray(data?.apps) ? data.apps : []).filter((a, i) => {
      const problems = validApp(a);
      if (problems.length) console.warn(`apps.json entry ${i} (${a?.id ?? "?"}) left out, check: ${problems.join(", ")}`);
      return !problems.length;
    });
    draw();
    applyView(true); // a shared link ending in #apps opens straight on the apps, once they are drawn

    await Promise.all(state.apps.filter((a) => !a.restricted).map(async (app) => {
      state.releases.set(app.id, await fetchRelease(app.repo));
      // Replace only this card, so focus elsewhere on the page is kept.
      document.querySelector(`[data-app="${app.id}"]`)?.replaceWith(card(app));
    }));
  }

  start();
})();
