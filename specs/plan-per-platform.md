---
type: Plan
title: Per-platform optimization rollout
description: The order in which every KS-Suite app audits, plans and tunes each platform build for its own OS, the gaps to check in each, and where each app stands.
tags: [plan, platforms, optimization, android, google-tv, macos, windows]
---

# Per-platform optimization rollout

The rule is in [Platform folders](platform-folders.md#each-platform-build-is-optimized-for-its-os): each platform build of every app is its own app, tuned to its OS (look and input, startup, hardware decoding and native media stack, packaging and size, OS integrations, accessibility), with as few dependencies as possible. Each platform build also has its own version through platform tags ([Versioning and signing](versioning-signing.md#platform-tags-own-version-per-platform)). This plan covers how the suite gets there. Each app's own work lives in its repository.

## How each app does it

1. The app's own session writes an audit and a plan in the app's `specs/`, modelled on ks-jaiplayer's [`specs/plan-per-platform.md`](https://github.com/kumarsumit17/ks-jaiplayer/blob/dev/specs/plan-per-platform.md): an audit table, one section per platform, the decisions it needs from the owner, and a build order with tests.
2. The owner approves the plan before any building starts.
3. The app builds it on `dev` and releases it by the [Release cycle](release-cycle.md). It tests every platform by [Testing on every platform](testing.md). Hand checks and paid signing never block a release.
4. Each app moves to platform tags (one-platform apps too). An app that checks for updates ships one plain bridge release first ([Versioning and signing](versioning-signing.md#platform-tags-own-version-per-platform)).

## Order and status

| # | App | Platforms | Status (2026-11-25) |
|---|---|---|---|
| 0 | `ks-jaiplayer` | Android, Google TV, macOS, Windows | Plan approved; building the optimizations. Moved to one `vX.Y.Z` (0368fb6); platform tags are back, so it moves again |
| 1 | `ks-streamflix` | Android, Google TV, macOS and Windows server | Plan drafted on `dev` (a8f1835), waiting for the owner's approval. v1.1.0 (the phone/TV split) can be its bridge release. Its own gaps: closing the desktop window stops the server; the computer may sleep mid-stream; FFmpeg is a separate install; the TV has no passthrough, HDR or frame-rate matching |
| 2 | `ks-beam` | Android, Google TV, macOS, Windows | Plan approved. Steps 2 and 3 on `dev`: senders keep a cast alive (0915924); the Google TV receiver runs as a foreground service with a media session, audio focus and frame-rate matching, tested on every TV size except 75 inch (d868b2f). Next: step 4, desktop look and input, when the owner says go |
| 3 | `ks-tv-launcher` | Google TV | Brief sent; every TV size, 43 to 100 inch |
| 4 | `ks-download-manager` | macOS, Windows, Chrome extension | Brief sent |
| 5 | `ks-vault` | Android | Plan approved 2026-11-25. Step 1 is on `dev` (199495e): the APK went from 9.6 to 7.3 MB. Next: cold start and unlock time on a real phone, TalkBack and font scale, then stage 2 |
| 6 | `ks-expense-manager` | Android | **Done**: plan approved 2026-11-25, released as v0.1.0 (47ffdef). Hand checks left (they don't block a release): cold start on a real phone, a TalkBack session by ear |
| 7 | `ks-forge` | macOS, Windows | Plan approved 2026-11-25 (8c00f19). Building: macOS menus, Dock and Finder; Windows title-bar tabs, Explorer, jump list; blur, notifications, screen readers (9c7c48c). Unsigned until certificates; the owner's Windows hand check after step 4 |

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
