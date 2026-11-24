// Builds the landing page's app list (site/apps.json) from GitHub, so a new app or a
// first release shows up without editing this repository. See specs/landing-page.md.
//
//   node .github/scripts/collect-apps.mjs [file]   (default: site/apps.json, rewritten in place)
//
// 1. Every public, non-fork, non-archived repository of OWNER that has a ks-suite.json card
//    on its default branch is an app. The card is an apps.json entry without "repo".
// 2. The apps already in the file stay, in their order, as the fallback; a card replaces the
//    fields it gives. Apps found only through a card are added after them.
// 3. Each app's status comes from its releases: a published release gives "released", only
//    pre-releases give "beta", none gives "coming-soon". A card or entry saying "beta" stays beta.
// A failed GitHub call never empties the page: what cannot be read keeps its fallback.
// No dependencies; needs Node 20+. GITHUB_TOKEN (optional) raises the API rate limit.

import { readFile, writeFile } from "node:fs/promises";

const FILE = process.argv[2] || "site/apps.json";
const OWNER = process.env.KS_OWNER || "kumarsumit17";
const CARD = "ks-suite.json";
const API = "https://api.github.com";

const headers = { Accept: "application/vnd.github+json", "User-Agent": "ks-suite-pages" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const warn = (msg) => console.log(`::warning::${msg}`);

async function get(path, accept) {
  const res = await fetch(`${API}${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return accept ? res.text() : res.json();
}

async function listRepos() {
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await get(`/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`);
    if (!batch?.length) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos.filter((r) => !r.fork && !r.archived && !r.private);
}

async function readCard(repo) {
  const text = await get(`/repos/${repo.full_name}/contents/${CARD}`, "application/vnd.github.raw+json");
  if (text == null) return null;
  let card;
  try { card = JSON.parse(text); } catch (err) { warn(`${repo.full_name}/${CARD} is not valid JSON: ${err.message}`); return null; }
  if (!card || typeof card !== "object" || Array.isArray(card)) { warn(`${repo.full_name}/${CARD} is not an object`); return null; }
  const { repo: _ignored, ...fields } = card;
  return { id: repo.name, ...fields, repo: repo.full_name };
}

async function statusFromReleases(app) {
  const releases = await get(`/repos/${app.repo}/releases?per_page=20`);
  const published = (releases || []).filter((r) => !r.draft);
  if (!published.length) return "coming-soon";
  if (app.status === "beta") return "beta";
  return published.some((r) => !r.prerelease) ? "released" : "beta";
}

const data = JSON.parse(await readFile(FILE, "utf8"));
const apps = Array.isArray(data.apps) ? data.apps : [];
const groups = new Set((data.groups || []).map((g) => g.id));

let repos = [];
try {
  repos = await listRepos();
} catch (err) {
  warn(`Could not list ${OWNER}'s repositories, keeping the app list as it is: ${err.message}`);
}

for (const repo of repos) {
  let card;
  try { card = await readCard(repo); } catch (err) { warn(`Could not read ${repo.full_name}/${CARD}: ${err.message}`); continue; }
  if (!card) continue;
  if (!groups.has(card.group)) warn(`${repo.full_name}/${CARD}: group "${card.group}" is not in ${FILE}; the page will leave it out.`);
  const i = apps.findIndex((a) => a.id === card.id || a.repo === card.repo);
  if (i >= 0) {
    apps[i] = { ...apps[i], ...card };
    console.log(`card   ${card.repo}`);
  } else {
    apps.push(card);
    console.log(`new    ${card.repo}`);
  }
}

for (const app of apps) {
  if (app.restricted || typeof app.repo !== "string") continue;
  try {
    app.status = await statusFromReleases(app);
  } catch (err) {
    warn(`Could not read ${app.repo}'s releases, keeping status "${app.status}": ${err.message}`);
  }
  console.log(`${String(app.status).padEnd(12)} ${app.repo}`);
}

data.apps = apps;
await writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${apps.length} apps to ${FILE}.`);
