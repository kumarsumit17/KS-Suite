---
type: Plan
title: Per-platform optimization rollout
description: The order in which every KS-Suite app audits, plans and tunes each platform build for its own OS, the gaps to check in each, and where each app stands.
tags: [plan, platforms, optimization, android, google-tv, macos, windows]
---

# Per-platform optimization rollout

The rule is in [Platform folders](platform-folders.md#each-platform-build-is-optimized-for-its-os): each platform build of every app is its own app, tuned to its OS (look and input, startup, hardware decoding and native media stack, packaging and size, OS integrations, accessibility), with as few dependencies as possible. Each platform build also has its own version through platform tags ([Versioning and signing](versioning-signing.md#platform-tags-own-version-per-platform)). This plan covers how the suite gets there. Each app's own work lives in its repository.

## How each app does it

1. The app's own session writes an audit and a plan in the app's `specs/`, modelled on ks-jaiplayer's [`specs/plan-per-platform.md`](https://github.com/kumasumit/ks-jaiplayer/blob/dev/specs/plan-per-platform.md): an audit table, one section per platform, the decisions it needs from the owner, and a build order with tests.
2. The owner approves the plan before any building starts.
3. The app builds it on `dev` and releases it by the [Release cycle](release-cycle.md). It tests every platform by [Testing on every platform](testing.md). Hand checks and paid signing never block a release.
4. Each app moves to platform tags (one-platform apps too). An app that checks for updates ships one plain bridge release first ([Versioning and signing](versioning-signing.md#platform-tags-own-version-per-platform)).

## Order and status

| # | App | Platforms | Status (2026-11-27) |
|---|---|---|---|
| 0 | `ks-jaiplayer` | Android, Google TV, macOS, Windows | Plan approved. Built: steps 1 to 6 (platform tags; Android media stack in part; Google TV Continue watching; phone background audio; macOS Now Playing and media keys; Windows keep-awake, single instance and media controls) and step 7 in part (Android subtitles). Latest: v1.9.0, `windows-v1.8.0`. ks-utility v0.14.0 |
| 1 | `ks-streamflix` | Android, Google TV, macOS and Windows server | Plan approved. Built: steps 1 to 3 (separate phone and TV apps; platform tags via the v1.2.0 bridge; the always-on desktop server, for v1.3.0). Latest: v1.2.0. Next: bundled FFmpeg. ks-utility v0.14.0 |
| 2 | `ks-beam` | Android, Google TV, macOS, Windows | Plan approved. Steps 1 to 6 built (platform tags, casts kept alive, Google TV receiver, desktop look and input, phone OS integrations, R8 and `jdk.accessibility`). Latest: v1.3.0. Next: step 7, the accessibility pass. ks-utility v0.14.0 |
| 3 | `ks-tv-launcher` | Google TV | Plan approved. Steps 1 to 5 built (layout, start-up with baseline profile and bundled Inter font, English and Hindi, accessibility, D-pad polish). Latest: `google-tv-v0.11.1`. Next: smoothness re-run on 85 and 100 inch and the owner's TV. ks-utility v0.14.0 |
| 4 | `ks-download-manager` | macOS, Windows, Chrome extension | Plan approved. Built: step 1 (Tauri project in `shared/`) and macOS step 2 in part (keep awake, Dock progress, notifications, drag and drop). Latest: v0.2.0. Next: Windows, then platform tags (`mac-`, `windows-`, `chrome-v`). ks-utility v0.14.0 |
| 5 | `ks-vault` | Android | Plan approved. Step 1 built (hardening, APK 9.6 → 7.3 MB). Latest: `android-v1.3.0`. Next: measurements, TalkBack and font scale, then stage 2. ks-utility v0.14.0 |
| 6 | `ks-expense-manager` | Android | Plan approved. Steps 1 to 3 built. Latest: `android-v0.4.0`. Hand checks left (they don't block a release): cold start on a real phone, a TalkBack session by ear. ks-utility v0.14.0 |
| 7 | `ks-forge` | macOS, Windows | Plan approved. Steps 1 to 4 built (updater on the release list, platform folders and several windows, macOS menus and Finder, Windows title-bar tabs; CI only). Latest: v0.2.1. Unsigned until certificates; the owner's Windows hand check is next. ks-utility v0.14.0 |

The order is a preference, not a gate. Each app moves at its own pace, and this table is updated when an app's plan is approved or released.

## Gaps to check in every app

These gaps were found in ks-jaiplayer and probably repeat elsewhere. Each audit says which ones apply.

- **Android:** R8 shrinking off; no audio focus or media session (media apps); picture-in-picture that does not enter on its own.
- **Google TV:** D-pad focus on every screen, 10-foot text sizes, every TV size.
- **Windows (Compose Desktop):** `jdk.accessibility` missing from the jlink modules, so Narrator and NVDA read nothing. Also: no file associations, no single-instance guard, the Swing look instead of a native one, a light title bar in dark mode.
- **macOS:** no Now Playing or media keys (media apps); the display may sleep during playback.
- **Accessibility everywhere:** icon buttons without labels; desktop controls left out of keyboard focus.

## Notes for the app sessions

- In auto mode, starting or stopping the shared emulators needs the owner's word in that session.
- The TV emulator's clock is off, so `lastUpdateTime` does not show whether an install failed.
- Sessions share the Gradle cache lock: wait for another session's build to finish, never kill it.
- Always set `ANDROID_SERIAL` ([Testing](testing.md#android-and-google-tv-emulators)).
