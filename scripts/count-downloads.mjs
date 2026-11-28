// Counts release downloads for each app and platform. See specs/landing-page.md, "Download counts".
//
//   node scripts/count-downloads.mjs [--json]
//
// Reads the apps from site/apps.json and every published release from the GitHub releases API
// (read only). No dependencies; needs Node 20+. GITHUB_TOKEN (optional) raises the API rate limit.
// A failed call stops the run: partial totals are never printed.

import { readFile } from "node:fs/promises";

const API = "https://api.github.com";
const headers = { Accept: "application/vnd.github+json", "User-Agent": "ks-suite-downloads" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const PLATFORMS = ["android", "google-tv", "macos-arm64", "macos-x64", "macos", "windows", "chrome"];
const LABELS = ["Android", "Google TV", "mac arm64", "mac x64", "mac all", "Windows", "Chrome"];

// Not installers: checksums, signatures, updater metadata, Play bundles, bundled FFmpeg source.
const SKIP = /^sha256sums(\.txt)?$|\.(sig|sha256|blockmap|aab)$|^latest\.json$|^ffmpeg-[\d.]+\.tar\.xz$/i;

// The names the release workflows produce. Anything else is listed as unclassified.
function classify(name, app) {
  const version = String.raw`v\d+\.\d+\.\d+`;
  // ks-tv-launcher's early releases; an app without an Android phone build has only the TV one.
  if (name === "app-release-google-tv.apk") return "google-tv";
  if (name === "app-release.apk") return app.platforms.includes("android") ? "android" : "google-tv";
  const prefix = `${app.repo.split("/")[1]}-`;
  if (!name.startsWith(prefix)) return null;
  const rest = name.slice(prefix.length);
  const rules = [
    ["google-tv", `${version}-google-tv\\.apk`],
    ["android", `${version}\\.apk`],
    ["macos-arm64", `${version}-macos-arm64\\.dmg`],
    ["macos-x64", `${version}-macos-x64\\.dmg`],
    ["windows", `${version}-windows-x64(\\.msi|-setup(-beta)?\\.exe)`],
    ["chrome", `extension-${version}\\.zip`],
  ];
  return rules.find(([, pattern]) => new RegExp(`^${pattern}$`).test(rest))?.[0] ?? null;
}

async function releasesOf(repo) {
  const all = [];
  for (let page = 1; ; page++) {
    const path = `/repos/${repo}/releases?per_page=100&page=${page}`;
    const res = await fetch(`${API}${path}`, { headers });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((r) => !r.draft).sort((a, b) => a.published_at.localeCompare(b.published_at));
}

const zero = () => Object.fromEntries(PLATFORMS.map((p) => [p, 0]));

function add(counts, platform, n) {
  counts[platform] += n;
  if (platform.startsWith("macos-")) counts.macos += n;
}

const sum = (c) => c.android + c["google-tv"] + c.macos + c.windows + c.chrome;

const { apps } = JSON.parse(await readFile(new URL("../site/apps.json", import.meta.url), "utf8"));
const report = { date: new Date().toISOString(), apps: [], totals: zero(), unclassified: [] };

for (const app of apps) {
  const releases = (await releasesOf(app.repo)).map((r) => {
    const counts = zero();
    for (const asset of r.assets) {
      if (SKIP.test(asset.name)) continue;
      const platform = classify(asset.name, app);
      if (platform) add(counts, platform, asset.download_count);
      else report.unclassified.push({ app: app.id, tag: r.tag_name, asset: asset.name, downloads: asset.download_count });
    }
    return { tag: r.tag_name, published: r.published_at, total: sum(counts), counts };
  });
  const counts = zero();
  for (const r of releases) for (const p of PLATFORMS) counts[p] += r.counts[p];
  for (const p of PLATFORMS) report.totals[p] += counts[p];
  report.apps.push({
    id: app.id,
    releases: releases.length,
    total: sum(counts),
    counts,
    first: releases[0] ?? null,
    latest: releases.at(-1) ?? null,
  });
}
report.total = sum(report.totals);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const row = (cells) => `| ${cells.join(" | ")} |`;
  const one = (r) => (r ? `${r.tag}: ${r.total}` : "-");
  console.log(`Release downloads, ${report.date.slice(0, 10)} (downloads, not installs)\n`);
  console.log(row(["App", ...LABELS, "Total", "First release", "Latest release"]));
  console.log(row(["---", ...LABELS.map(() => "--:"), "--:", "---", "---"]));
  for (const a of report.apps) {
    console.log(row([a.id, ...PLATFORMS.map((p) => a.counts[p]), a.total, one(a.first), one(a.latest)]));
  }
  console.log(row(["Total", ...PLATFORMS.map((p) => report.totals[p]), report.total, "", ""]));
  console.log(`\nUnclassified assets: ${report.unclassified.length || "none"}`);
  for (const u of report.unclassified) console.log(`- ${u.app} ${u.tag} ${u.asset}: ${u.downloads}`);
}
