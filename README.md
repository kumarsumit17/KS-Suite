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

| App | What it does | Platform | Status |
|---|---|---|---|
| 📺 [**ks-tv-launcher**](https://github.com/kumasumit/ks-tv-launcher) | Ad-free, Apple TV-style launcher with a glass UI, a live weather widget, and a streaming-subscription tracker with renewal reminders. | Android TV / Google TV | ✅ Released · [v0.7.3](https://github.com/kumasumit/ks-tv-launcher/releases) |
| ▶️ [**ks-jaiplayer**](https://github.com/kumasumit/ks-jaiplayer) | Multi-platform media player with a shared Kotlin core and a native playback engine on each target. | Android · Google TV · Windows · macOS | 🛠 Planned |
| 🎬 [**ks-streamflix**](https://github.com/kumasumit/ks-streamflix) | Lean, D-pad optimized streaming media manager with fast focus navigation. | Android TV | 🛠 Planned |
| 🔐 [**ks-vault**](https://github.com/kumasumit/ks-vault) | Fully offline secure vault and notekeeper behind pattern/password authentication, for notes, government IDs, and tickets. | Android | 🛠 Planned |
| 💰 [**ks-expense-manager**](https://github.com/kumasumit/ks-expense-manager) | Minimalist, privacy-first personal finance and expense tracker. | Android | 🛠 Planned |
| ⬇️ [**ks-download-manager**](https://github.com/kumasumit/ks-download-manager) | Free download manager for images, audio and video, with up to 20× faster downloads. | Windows · macOS (Chrome extension under consideration) | 🚧 In development · [stages 1–4 of 9 done](https://github.com/kumasumit/ks-download-manager/blob/dev/specs/stages.md) |

"Planned" means the repository holds the project structure and its rules, with app code still to come. "In development" means app code is being built in stages, with no release yet.

### Tech stacks

| App | Stack |
|---|---|
| `ks-tv-launcher` | Kotlin · Jetpack Compose for TV (tv-material) · DataStore · Coil · WorkManager |
| `ks-jaiplayer` | Kotlin Multiplatform · Compose Multiplatform · Media3/ExoPlayer · VLCJ |
| `ks-streamflix` | Kotlin · Jetpack Compose for TV · Media3/ExoPlayer · Room · Hilt |
| `ks-vault` | Kotlin · Jetpack Compose · Room + SQLCipher · Android Keystore · BiometricPrompt |
| `ks-expense-manager` | Kotlin · Jetpack Compose · Room · Vico · DataStore |
| `ks-download-manager` | Rust · Tauri · TypeScript + React · shadcn/ui (Chrome extension: TypeScript, Manifest V3) |

### Shared utilities

[**ks-utility**](https://github.com/kumasumit/ks-utility) holds common, generic utility functions for the suite. Every app takes it as a dependency pinned to a commit: the Kotlin apps as a git submodule built by Gradle, `ks-download-manager` through `package.json` and `Cargo.toml`. Application-specific logic stays in the app. `ks-tv-launcher` is still being moved onto it: its submodule and Gradle wiring are not committed yet. Status: 🛠 Planned.

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
