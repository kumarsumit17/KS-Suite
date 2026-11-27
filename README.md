# KS-Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Kotlin](https://img.shields.io/badge/Kotlin-Android%20%26%20TV%20apps-7F52FF?logo=kotlin&logoColor=white)
![Rust](https://img.shields.io/badge/Rust%20%2B%20Tauri-desktop-DEA584?logo=rust&logoColor=white)
![No tracking](https://img.shields.io/badge/Analytics%20%26%20ads-none-success)

**KS-Suite** is a family of free, privacy-focused apps for the living room, the desktop, and your pocket.

> ## ⬇️ Get the apps
> **[kumasumit.github.io/ks-suite](https://kumasumit.github.io/ks-suite/)** lists every app with download buttons for the newest release, in English and Hindi.
>
> Everything below is for developers.

This repository is the suite's front door: it links to every app, and holds the conventions they all share. Each app lives in its own repository, and so does [`ks-utility`](https://github.com/kumasumit/ks-utility), the generic utility code every app depends on.

- **Private by default.** Your data stays on your device unless you choose otherwise.
- **Lean and fast.** No bloat, no ads and no tracking SDKs, with UIs tuned for the device in your hand or the remote on your couch.
- **One standard.** Shared conventions for code style, versioning, signing, and releases across every repository.

**Contents:** [Apps](#-apps) · [Getting the code](#-getting-the-code) · [Workspace layout](#-workspace-layout) · [How the apps relate](#-cross-repository-relationships) · [CI/CD](#-cicd-semantic-versioning--automated-signing) · [License](#-license)

---

## 📂 Apps

| App | What it does | Platforms | Status |
|---|---|---|---|
| 📺 [**ks-tv-launcher**](https://github.com/kumasumit/ks-tv-launcher) | Ad-free TV launcher with a glass look, live weather, and a tracker for your streaming subscriptions with renewal reminders. | Google TV | ✅ Released · [releases](https://github.com/kumasumit/ks-tv-launcher/releases) |
| ⬇️ [**ks-download-manager**](https://github.com/kumasumit/ks-download-manager) | Free download manager for images, audio and video, with up to 20× faster downloads. | macOS · Windows (beta) · Chrome extension | ✅ Released · [releases](https://github.com/kumasumit/ks-download-manager/releases) |
| ⌨️ [**ks-forge**](https://github.com/kumasumit/ks-forge) | Fast, private terminal for macOS and Windows, with tabs, split panes, themes and profiles. | macOS · Windows (beta) | ✅ Released · [releases](https://github.com/kumasumit/ks-forge/releases) |
| ▶️ [**ks-jaiplayer**](https://github.com/kumasumit/ks-jaiplayer) | Media player for phone, TV and desktop, with a native playback engine on each. | Android · Google TV · Windows (beta) · macOS | ✅ Released · [releases](https://github.com/kumasumit/ks-jaiplayer/releases) |
| 🎬 [**ks-streamflix**](https://github.com/kumasumit/ks-streamflix) | Free, open-source home media server: run it on your Mac or Windows PC, then browse and stream your library on phone and TV. | macOS · Windows (beta) · Android · Google TV | ✅ Released · [releases](https://github.com/kumasumit/ks-streamflix/releases) |
| 📡 [**ks-beam**](https://github.com/kumasumit/ks-beam) | Cast videos, music and photos from your phone or computer to a TV or projector. | Android · Windows (beta) · macOS · Google TV | ✅ Released · [releases](https://github.com/kumasumit/ks-beam/releases) |
| 🔐 [**ks-vault**](https://github.com/kumasumit/ks-vault) | Fully offline vault for notes, IDs and tickets, behind a pattern or password. | Android | ✅ Released · [releases](https://github.com/kumasumit/ks-vault/releases) |
| 💰 [**ks-expense-manager**](https://github.com/kumasumit/ks-expense-manager) | Minimal, private tracker for your personal expenses. | Android | ✅ Released · [releases](https://github.com/kumasumit/ks-expense-manager/releases) |

Every release, with its files for each platform, is on the app's releases page; the [landing page](https://kumasumit.github.io/ks-suite/) offers the newest file for each platform.

### Tech stacks

| App | Stack |
|---|---|
| `ks-tv-launcher` | Kotlin · Compose for TV |
| `ks-download-manager` | Rust · Tauri |
| `ks-forge` | Rust · Tauri · TypeScript |
| `ks-jaiplayer` | Kotlin Multiplatform |
| `ks-streamflix` | Kotlin Multiplatform |
| `ks-beam` | Kotlin Multiplatform |
| `ks-vault` | Kotlin · Compose |
| `ks-expense-manager` | Kotlin · Compose |

### Shared utilities

[**ks-utility**](https://github.com/kumasumit/ks-utility) holds the generic code every app shares: the updater, language files, the shared release workflows and `ks-suite-check`, which checks every app against the suite's rules before each release. Each app pins the newest ks-utility tag (the Kotlin apps as a git submodule, the Tauri apps through `package.json` and `Cargo.toml`) and moves to each new tag the same day.

---

## 🚀 Getting the code

Each app is a separate repository, so clone only what you need. To recreate the whole workspace:

```bash
git clone https://github.com/kumasumit/ks-suite.git
cd KS-Suite
for app in ks-tv-launcher ks-jaiplayer ks-streamflix ks-vault ks-expense-manager ks-download-manager ks-utility; do
  git clone --recurse-submodules "https://github.com/kumasumit/$app.git"
done
```

The app folders and `ks-utility` are git-ignored here, so this repository never tracks their contents. The Kotlin apps need **JDK 17**; `ks-download-manager` needs Rust and Node.js. Each Kotlin app also carries `ks-utility` as a git submodule, which `--recurse-submodules` fetches. Each app's own `README.md` has its build and install steps.

---

## 🗂 Workspace Layout

```
KS-Suite/
├── README.md               ← you are here
├── CLAUDE.md               ← suite-wide rules for AI-assisted work
├── specs/                  ← suite-wide specs (OKF bundle)
├── .claude/                ← graphify setup for AI-assisted work
├── LICENSE
├── .gitignore              ← ignores the app folders and ks-utility (each is its own repo)
├── ks-tv-launcher/         ← git repo
├── ks-jaiplayer/           ← git repo (KMP: shared/, androidApp/, desktopApp/)
├── ks-streamflix/          ← git repo
├── ks-vault/               ← git repo
├── ks-expense-manager/     ← git repo
├── ks-download-manager/    ← git repo
└── ks-utility/             ← git repo (shared generic utilities, not an app)
```

Each app repository contains:

```
<app>/
├── .github/workflows/release.yml   ← standardized release pipeline (Kotlin apps)
├── .gitignore                      ← build output, .gradle/, keystores
├── .claude/                        ← graphify setup (ks-tv-launcher: scripts/kb.py instead)
├── CLAUDE.md                       ← stack, platform constraints, build commands
├── ks-utility/                     ← git submodule: shared generic utilities (Kotlin apps)
├── shared/                         ← code used by two or more platforms (multi-platform apps only)
├── tv/google-tv/                   ← platform folders, the same in every app repo
├── desktop/mac/  desktop/windows/
├── mobile/android/  mobile/ios/
├── app/ (or shared/ + platform apps) ← existing code, not yet moved into the platform folders
├── docs/
├── specs/                          ← specs (OKF bundle)
├── LICENSE
└── README.md
```

Every app repository has all five platform folders, including those for platforms it does not target yet; `ks-utility` keeps its own layout. The rules and each app's targets are in [specs/platform-folders.md](specs/platform-folders.md).

---

## 🕸 Cross-Repository Relationships

The apps share **no runtime services** and never depend on each other. Each one builds, ships, and works alone. The only shared code is generic utilities in [`ks-utility`](https://github.com/kumasumit/ks-utility), which every app takes as a dependency pinned to a commit. Every link between the apps is an explicit Android intent that the user starts. The diagram and the contract on each edge are in [specs/cross-repo.md](specs/cross-repo.md), and the conventions the repos share in [specs/conventions.md](specs/conventions.md).

> When an edge contract changes, update [specs/cross-repo.md](specs/cross-repo.md) and the `CLAUDE.md` files on **both** sides in the same release cycle.

---

## 🚀 CI/CD: Semantic Versioning & Automated Signing

Every Kotlin app repository ships the same GitHub Actions pipeline in `.github/workflows/release.yml`; `ks-download-manager` gets its release workflow in its final build stage. Releases are triggered by an annotated `vMAJOR.MINOR.PATCH` tag, `versionName` and `versionCode` are derived from it, and signing keys come only from repository secrets. Details: [specs/versioning-signing.md](specs/versioning-signing.md).

---

## 📜 License

All KS-Suite projects are released under the **MIT License**. See [LICENSE](LICENSE).

Copyright © 2026 Kumar Sumit
