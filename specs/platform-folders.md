---
type: Policy
title: Platform folders
description: The platform folders every KS-Suite app repository has, which platforms each app targets, and the shared/ folder for code several platforms use.
tags: [layout, platforms, policy]
---

# Platform folders

Every app repository has the same three platform groups in its root, with the same platforms inside:

```
<app>/
├── shared/            ← code used by two or more platforms (only in apps with more than one target)
├── tv/
│   └── google-tv/
├── desktop/
│   ├── mac/
│   └── windows/
└── mobile/
    ├── android/
    └── ios/
```

`ks-utility` is a helpers repository, not an app, and keeps its own layout (`kotlin/`, `typescript/`, `rust/`).

## Rules

- All five folders exist in every app repository, whether or not the app supports that platform yet. A folder that holds only a `.gitkeep` marks where that platform's code would go; it is not missing work.
- Code for one platform goes in that platform's folder.
- Code used by two or more platforms of the same app goes in `shared/` in the repository root. It is written once and never copied between platform folders. The name is fixed: `shared/` in every app repository, nothing else.
- A platform folder then holds only what is specific to that platform: its entry point, packaging, signing and platform-only code.
- An app with one target has no `shared/` folder; all its code is in its one platform folder.
- A new platform is added to every app repository at once, by changing this spec first. No repository adds, renames or removes a platform folder on its own.

## Three layers

| Where | Holds | Used by |
|---|---|---|
| A platform folder, such as `desktop/mac/` | Code for one platform | One platform of one app |
| `shared/` | Code for several platforms | Several platforms of one app |
| `ks-utility` (its own repository) | Generic helpers with no application-specific logic | Several apps |

Code moves outward only when it is needed there: from a platform folder to `shared/` when a second platform needs it, and from an app to `ks-utility` only when it is generic and another app needs it too.

## Targets

| App | Targets | Empty for now | `shared/` |
|---|---|---|---|
| `ks-tv-launcher` | `tv/google-tv` | `desktop/*`, `mobile/*` | no |
| `ks-jaiplayer` | `mobile/android`, `tv/google-tv` (separate TV app from v1.2.0), `desktop/windows`, `desktop/mac` | `mobile/ios` | yes: the Kotlin Multiplatform module |
| `ks-streamflix` | `desktop/mac`, `desktop/windows` (the server with its window), `mobile/android`, `tv/google-tv` (one APK until its TV split) | `mobile/ios` | yes: the API models, the server core and its plugins, the apps' Kotlin Multiplatform module and the desktop app |
| `ks-vault` | `mobile/android` | `tv/*`, `desktop/*`, `mobile/ios` | no |
| `ks-expense-manager` | `mobile/android` | `tv/*`, `desktop/*`, `mobile/ios` | no |
| `ks-download-manager` | `desktop/mac`, `desktop/windows` | `tv/*`, `mobile/*` | yes: `src/`, `src-tauri/` and `extension/`, once moved |
| `ks-beam` | `mobile/android`, `tv/google-tv` (one APK until its TV split: sender on phones, receiver on TVs), `desktop/windows`, `desktop/mac` | `mobile/ios` | yes: the Kotlin Multiplatform module (casting core, receiver protocol and interface) |

## Phone and Google TV builds
Each app's folders decide which Android builds it ships; there is no "build both" rule:
- **A `tv/google-tv` application module next to `mobile/android`:** two apps, a phone APK and AAB and a separate TV APK and AAB (`<app>-v<version>-google-tv.apk`, the release workflow's `tv-module`). The TV interface is a different one (D-pad focus, 10-foot layout, banner, Leanback entry), so a separate build keeps each small and keeps TV changes from breaking the phone app. Both have the same package name, version and keystore; the TV app's `versionCode` adds 1,000,000,000 ([Versioning and signing](versioning-signing.md)). Code both run lives in `shared/`. Each updates to its own build (ks-utility `UpdatePlatform.GOOGLE_TV` / `ANDROID`). `ks-jaiplayer` from v1.2.0; `ks-streamflix` and `ks-beam` next.
- **Phone only** (`ks-vault`, `ks-expense-manager`): no TV build. A phone interface on a TV is unusable with a remote.
- **TV only** (`ks-tv-launcher`): only the TV APK, with no Android build.
- **No Android** (`ks-download-manager`): neither.
- One universal APK for phone and TV only when an app's TV and phone screens are nearly the same, which is rare. Before an app that updates itself first ships two APKs, it releases its new update checker in a one-APK release, so copies already installed pick the right file afterwards. An app with no in-app updater (`ks-beam`) skips this step.

## Existing code

The folders were added on 2026-11-21. Code that existed before then has not moved yet:

- `ks-tv-launcher` still builds from `app/` in its repository root, and `ks-download-manager` from `src/` and `src-tauri/`. Moving them is a separate change in each repository, because it touches build settings and release workflows and has to be built and tested.
- The four planned apps still have their empty skeletons (`app/`, or `shared/`, `androidApp/` and `desktopApp/`) in the root. Their code goes into the platform folders when their builds are created.

Each app's `CLAUDE.md` says where its code is now and where it goes.
