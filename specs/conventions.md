---
type: Policy
title: Shared conventions
description: The conventions every KS-Suite repository follows, and where shared code is allowed.
tags: [conventions, policy]
---

# Shared conventions


| Concern | Convention | Defined in |
|---|---|---|
| Language / build | Kotlin, Gradle KTS, version catalog, JDK 17. Exception: `ks-download-manager` and `ks-forge` (desktop only) use Rust, Tauri and TypeScript | root `CLAUDE.md` |
| Package root | `com.ks.<app>` | root `CLAUDE.md` |
| Repository layout | Every app repo has `tv/google-tv`, `desktop/mac`, `desktop/windows`, `mobile/android` and `mobile/ios`; `ks-utility` keeps its own layout | [Platform folders](platform-folders.md) |
| TV UX | D-pad first, 48dp/27dp overscan margins | `ks-tv-launcher`, `ks-streamflix`, `ks-jaiplayer` `CLAUDE.md` |
| Privacy | No analytics/ads SDKs; vault and expense apps have no `INTERNET` permission | each `CLAUDE.md` |
| Shared code | Only generic utilities, kept in `ks-utility`; every app takes it as a dependency pinned to a commit; application-specific logic stays in the app | [Cross-repository relationships](cross-repo.md), `ks-utility` `CLAUDE.md` |
| AI-assisted work | graphify setup committed in every repo (`.claude/`), `graphify-out/` git-ignored; `ks-tv-launcher` uses its own `scripts/kb.py` graph | each `CLAUDE.md` |
| Release | Tag-driven SemVer and CI signing | [Versioning and signing](versioning-signing.md) |
| App icons | Every build on every platform shows the app's own icon, never a framework default (Kotlin, Compose, Android, Tauri) | [App icons](#app-icons) below |

The rules themselves are listed in the root `CLAUDE.md`.

## App icons

Owner's rule (2026-11-27), for every app: no build on any platform shows a default framework icon (the Kotlin or Compose Multiplatform logo, Android's default green robot `ic_launcher`, Tauri's default logo). Each one uses the app's own icon, made for that platform:

- **Android phone:** an adaptive launcher icon (foreground, background and monochrome layers) plus the round and legacy versions.
- **Google TV:** the launcher icon and the 320×180 `android:banner` that the TV home screen shows.
- **macOS:** an `.icns` set in `nativeDistributions { macOS { iconFile } }` (Compose) or `bundle.icon` (Tauri), so the `.app`, the Dock, Finder and the `.dmg` all show it; the window, menu bar or tray icon too where the app has one.
- **Windows:** an `.ico` with every size from 16 to 256 px in `nativeDistributions { windows { iconFile } }` or `bundle.icon`, so the installer, Start menu, taskbar and Explorer show it; the window icon (`Window(icon = …)` in Compose) as well, since a Compose window otherwise shows the Kotlin logo in its title bar and taskbar.
- **Chrome extension:** its own 16, 32, 48 and 128 px icons in `manifest.json`.

Each app keeps its icon sources in its repository and checks before a release that no default icon is left in any build. A build that still shows one is a bug, fixed in the next release.
