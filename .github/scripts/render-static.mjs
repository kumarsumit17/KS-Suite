// KS-Suite landing page. Draws every app card from apps.json and fills the download
// buttons from the GitHub releases API. Plain JavaScript, no build step, no libraries.
"use strict";

import { readFile, writeFile } from "node:fs/promises";

const SITE = process.argv[2] || "site";
const PAGE = "https://kumasumit.github.io/ks-suite/";
const START = "<!-- static-apps:start -->";
const END = "<!-- static-apps:end -->";
const LD_START = "<!-- json-ld:start -->";
const LD_END = "<!-- json-ld:end -->";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const replaceBetween = (text, a, b, inner) => {
  const i = text.indexOf(a), j = text.indexOf(b);
  if (i < 0 || j < i) throw new Error(`markers ${a} … ${b} not found`);
  return text.slice(0, i + a.length) + inner + text.slice(j);
};

const data = JSON.parse(await readFile(`${SITE}/apps.json`, "utf8"));
const en = JSON.parse(await readFile(`${SITE}/lang/en.json`, "utf8"));
const PLATFORM = { "google-tv": "Google TV", android: "Android", ios: "iOS", windows: "Windows", macos: "macOS", chrome: "Chrome extension" };
const STATUS = { released: "Released", beta: "Beta", "coming-soon": "Coming soon" };
const OS = { "google-tv": "Android TV", android: "Android", ios: "iOS", windows: "Windows", macos: "macOS", chrome: "ChromeOS" };
const apps = data.apps.filter((a) => !a.restricted);

// 1. The static list, grouped like the page.
const groups = data.groups.map((g) => {
  const list = apps.filter((a) => a.group === g.id);
  if (!list.length) return "";
  const items = list.map((a) => {
    const repo = `https://github.com/${a.repo}`;
    const platforms = a.platforms.map((p) => PLATFORM[p] || p).join(", ");
    return `
          <article class="static-app">
            <h4>${esc(a.name)}</h4>
            <p>${esc(a.tagline.en)}</p>
            <p>Platforms: ${esc(platforms)}. ${esc(STATUS[a.status] || a.status)}.${a.stack ? ` Built with ${esc(a.stack)}.` : ""}</p>
            <p><a href="${repo}/releases">Download ${esc(a.name)}</a> · <a href="${repo}">Source code</a></p>
          </article>`;
  }).join("");
  return `
        <section class="static-group">
          <h3>${esc(g.title.en)}</h3>${items}
        </section>`;
}).join("");
const staticHtml = `${groups}
        `;

// 2. Structured data: the site, and one SoftwareApplication per app.
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${PAGE}#site`,
      url: PAGE,
      name: "KS-Suite",
      description: en["hero.lead"] || "Free, privacy-focused apps with no ads and no tracking.",
      inLanguage: ["en", "hi"],
    },
    {
      "@type": "ItemList",
      name: "KS-Suite apps",
      itemListElement: apps.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: a.name,
          description: a.tagline.en,
          applicationCategory: a.group === "desktop" ? "UtilitiesApplication" : a.group === "media" ? "MultimediaApplication" : "LifestyleApplication",
          operatingSystem: [...new Set(a.platforms.map((p) => OS[p] || p))].join(", "),
          url: `https://github.com/${a.repo}`,
          downloadUrl: `https://github.com/${a.repo}/releases`,
          codeRepository: `https://github.com/${a.repo}`,
          license: "https://opensource.org/licenses/MIT",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      })),
    },
  ],
};
const ldHtml = `\n  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>\n  `;

let page = await readFile(`${SITE}/index.html`, "utf8");
page = replaceBetween(page, START, END, staticHtml);
page = replaceBetween(page, LD_START, LD_END, ldHtml);
// Keep language alternates and share-preview metadata in the deployed HTML even when the
// source template is edited. This page presents both languages at one canonical URL.
const seoTags = [
  `  <link rel="alternate" hreflang="en" href="${PAGE}">`,
  `  <link rel="alternate" hreflang="hi" href="${PAGE}">`,
  `  <link rel="alternate" hreflang="x-default" href="${PAGE}">`,
  '  <meta name="author" content="Kumar Sumit">',
  '  <meta name="keywords" content="KS-Suite, free apps, open-source, privacy-first, no ads, no tracking, Android, Google TV, macOS, Windows">',
  '  <meta name="theme-color" content="#101114">',
  `  <meta property="og:image" content="${PAGE}icons/avatar.jpg">`,
  '  <meta property="og:image:alt" content="KS-Suite free, privacy-first apps">',
  '  <meta name="twitter:image" content="https://kumasumit.github.io/ks-suite/icons/avatar.jpg">',
];
for (const tag of seoTags) {
  const key = tag.match(/(?:hreflang="([^"]+)"|name="([^"]+)"|property="([^"]+)")/);
  const value = key?.[1] || key?.[2] || key?.[3];
  const attr = tag.includes("hreflang") ? "hreflang" : tag.includes("property=") ? "property" : "name";
  const pattern = new RegExp(`<link\\b(?=[^>]*\\b${attr}="${value}")[^>]*>|<meta\\b(?=[^>]*\\b${attr}="${value}")[^>]*>`, "i");
  if (pattern.test(page)) page = page.replace(pattern, tag.trim());
  else page = page.replace("</head>", `${tag}\n</head>`);
}
await writeFile(`${SITE}/index.html`, page);

// 3. Sitemap with language alternates and robots.txt for the GitHub Pages site.
const today = new Date().toISOString().slice(0, 10);
await writeFile(`${SITE}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${PAGE}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${PAGE}" />
    <xhtml:link rel="alternate" hreflang="hi" href="${PAGE}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${PAGE}" />
  </url>
</urlset>
`);
await writeFile(`${SITE}/robots.txt`, `User-agent: *
Allow: /

Sitemap: ${PAGE}sitemap.xml
`);
console.log(`Rendered ${apps.length} apps into ${SITE}/index.html; wrote ${SITE}/sitemap.xml and ${SITE}/robots.txt.`);
