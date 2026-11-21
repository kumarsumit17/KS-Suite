// KS-Suite landing page. Draws every app card from apps.json and fills the download
// buttons from the GitHub releases API. Plain JavaScript, no build step, no libraries.
"use strict";

(() => {
  const STORAGE_LANGUAGE = "ks-suite.language";
  const STORAGE_THEME = "ks-suite.theme"; // also read by theme-init.js
  const THEMES = ["light", "dark"];
  const CACHE_PREFIX = "ks-suite.release.";
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
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
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
    { id: "macArm", key: "download.macArm" },
    { id: "macIntel", key: "download.macIntel" },
    { id: "mac", key: "download.mac" },
    { id: "windows", key: "download.windows" },
    { id: "chrome", key: "download.chrome" },
    { id: "android", key: "download.android" },
  ];

  const state = { apps: [], text: {}, language: "en", releases: new Map() };

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

  function validApp(a) {
    const problems = [];
    if (!a || typeof a !== "object") return ["not an object"];
    if (typeof a.id !== "string" || !/^[a-z0-9-]+$/.test(a.id)) problems.push("id");
    if (typeof a.name !== "string" || !a.name) problems.push("name");
    if (typeof a.repo !== "string" || !/^[\w.-]+\/[\w.-]+$/.test(a.repo)) problems.push("repo");
    if (typeof a.icon !== "string" || !/^[\w.-]+\.svg$/.test(a.icon)) problems.push("icon");
    if (!STATUSES.includes(a.status)) problems.push("status");
    if (!Array.isArray(a.platforms) || !a.platforms.length || !a.platforms.every((p) => p in PLATFORMS)) problems.push("platforms");
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
    if (/\.apk$/.test(n)) return "android";
    return null;
  }

  function pickRelease(list, repo) {
    const release = (Array.isArray(list) ? list : []).find((r) => r && !r.draft);
    if (!release) return null;
    const repoName = repo.split("/")[1].toLowerCase();
    const best = {};
    for (const a of release.assets || []) {
      if (typeof a.name !== "string" || typeof a.browser_download_url !== "string") continue;
      if (!a.browser_download_url.startsWith("https://github.com/")) continue;
      if (!(a.size > 0)) continue;
      const kind = kindOf(a.name, repoName);
      if (kind && (!best[kind] || a.size > best[kind].size)) best[kind] = { url: a.browser_download_url, size: a.size };
    }
    const downloads = KINDS.filter((k) => best[k.id]).map((k) => ({ kind: k.id, ...best[k.id] }));
    if (!downloads.length) return null;
    return {
      version: String(release.tag_name || release.name || ""),
      date: release.published_at || release.created_at || "",
      prerelease: Boolean(release.prerelease),
      downloads,
    };
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
      const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`, {
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

  function releasesUrl(app) {
    return `https://github.com/${app.repo}/releases`;
  }

  function downloadsBlock(app) {
    const box = el("div", { class: "downloads", "aria-live": "polite" });
    if (app.status === "coming-soon") {
      box.append(el("p", { class: "muted" }, t("soon.note")));
      return box;
    }
    if (!state.releases.has(app.id)) {
      box.append(el("p", { class: "muted" }, t("release.checking")));
      return box;
    }
    const release = state.releases.get(app.id);
    if (!release) {
      box.append(el("a", { class: "btn btn-plain", href: releasesUrl(app) }, icon("external"), t("release.fallback")));
      return box;
    }
    for (const d of release.downloads) {
      const kind = KINDS.find((k) => k.id === d.kind);
      const platform = t(kind.key);
      const size = formatSize(d.size);
      box.append(
        el("a", { class: "btn", href: d.url, "aria-label": t("download.button", { platform, size }) },
          icon("download"), el("span", null, platform), el("span", { class: "size" }, size))
      );
    }
    return box;
  }

  function card(app) {
    const release = state.releases.get(app.id);
    const badges = el("div", { class: "badges" }, badge(app.status, statusKey(app.status)));
    if (release && release.prerelease && app.status !== "beta") badges.append(badge("prerelease", "status.prerelease"));

    const chips = el("ul", { class: "chips", "aria-label": t("platforms.label") },
      ...app.platforms.map((p) => el("li", null, icon(PLATFORMS[p].icon), t(PLATFORMS[p].key))));

    const titleId = `app-${app.id}`;
    const parts = [
      el("div", { class: "card-head" },
        el("img", { src: `icons/${app.icon}`, alt: "", width: "48", height: "48" }),
        el("div", null, el("h3", { id: titleId }, app.name), badges)),
      el("p", { lang: state.language }, app.tagline[state.language]),
      chips,
    ];
    if (release) {
      const date = formatDate(release.date);
      parts.push(el("p", { class: "muted" }, date ? t("release.info", { version: release.version, date }) : release.version));
    }
    parts.push(downloadsBlock(app));

    const links = el("p", { class: "links" });
    if (release) links.append(el("a", { href: releasesUrl(app) }, icon("external"), t("release.all")));
    links.append(el("a", { href: `https://github.com/${app.repo}` }, icon("code"), t("link.source")));
    parts.push(links);

    return el("li", { "data-app": app.id }, el("article", { class: "card", "aria-labelledby": titleId }, ...parts));
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

    const points = document.getElementById("points");
    points.replaceChildren(
      ...[["shield", "hero.private"], ["zap", "hero.lean"], ["code", "hero.open"]].map(([i, k]) => el("li", null, icon(i), el("span", null, t(k))))
    );
  }

  function drawApps() {
    document.getElementById("grid").replaceChildren(...state.apps.map(card));
  }

  function draw() {
    drawStatic();
    drawApps();
  }

  // ---------- Start ----------

  async function loadJson(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.json();
  }

  async function start() {
    state.language = resolveLanguage(savedChoice(), navigator.languages);

    document.getElementById("lang-select")?.addEventListener("change", (e) => {
      const choice = parseChoice(e.target.value);
      saveChoice(choice);
      state.language = resolveLanguage(choice, navigator.languages);
      draw();
    });

    for (const b of document.querySelectorAll("[data-theme-choice]")) {
      if (LUCIDE[b.dataset.icon]) b.replaceChildren(icon(b.dataset.icon));
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
      document.getElementById("grid").replaceChildren(
        el("li", null, el("a", { href: "https://github.com/kumarsumit17/KS-Suite#readme" }, "KS-Suite on GitHub")));
      return;
    }

    state.apps = (Array.isArray(data?.apps) ? data.apps : []).filter((a, i) => {
      const problems = validApp(a);
      if (problems.length) console.warn(`apps.json entry ${i} (${a?.id ?? "?"}) left out, check: ${problems.join(", ")}`);
      return !problems.length;
    });
    draw();

    await Promise.all(state.apps.filter((a) => a.status !== "coming-soon").map(async (app) => {
      state.releases.set(app.id, await fetchRelease(app.repo));
      // Replace only this card, so focus elsewhere on the page is kept.
      document.querySelector(`[data-app="${app.id}"]`)?.replaceWith(card(app));
    }));
  }

  start();
})();
