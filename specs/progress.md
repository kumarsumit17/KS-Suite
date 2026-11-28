---
type: Plan
title: Progress
description: The suite's checkpoint: the active group, open handoffs and decisions, where each app stands, owner steps pending, and shared changes waiting to be adopted.
tags: [plan, progress, tracker]
---

# Progress

Updated 2026-11-28. How it is kept: [Working method](working-method.md).

## Active group

`ks-utility`, `ks-jaiplayer` and `ks-streamflix` (owner's decision, 2026-11-28; [One development group at a time](working-method.md#one-development-group-at-a-time)).

Execution order (owner's decision, 2026-11-28):

1. `ks-utility`: only what JaiPlayer needs.
2. `ks-jaiplayer`: until the completion criteria in its [playback plan](https://github.com/kumasumit/ks-jaiplayer/blob/dev/specs/plan-playback.md) are met and its stable release is verified.
3. `ks-streamflix`: idle until the owner authorizes it; its pull request [kumasumit/ks-streamflix#1](https://github.com/kumasumit/ks-streamflix/pull/1) stays open. For now this includes its independent server work.

Claude Code sessions, one per repository ([Sessions and ownership](working-method.md#sessions-and-ownership)); checked 2026-11-28, no others open. Session ids change, so they are named by title.

| Repository | Session | Phase |
|---|---|---|
| `ks-suite` | KS-Suite main | Central governance only; idle unless needed. |
| `ks-utility` | ks-utility | v0.19.0 released. On `dev`: the DEV-build pin process (`e43563e`), in release pull request [kumasumit/ks-utility#1](https://github.com/kumasumit/ks-utility/pull/1), not tagged yet. |
| `ks-jaiplayer` | KS JaiPlayer | Release pull request #6 (1.12.0) waits for the owner; details below. |
| `ks-streamflix` | KS StreamFlix | v1.3.1 in production; `v1.4.0` not released (see [Apps](#apps)). Its approved plan's scope is an open decision. Idle until the owner authorizes it. |

**`ks-jaiplayer`** (active since 2026-11-27). Phase: **release pull request [#6](https://github.com/kumasumit/ks-jaiplayer/pull/6) (`dev` → `main`, 1.12.0) open, waiting for the owner's manual test and approval.** It carries the DEV variant side by side, audio effects (presets, Bass and Dialogue, a 10-band EQ; Android and Google TV with JaiPlayer's own processor, desktop with libVLC's EQ), phone player-bar extras on a second row, and ks-utility v0.19.0. DEV builds: run 46055963743 at fe14942 (replacing 46047978458), all green, Android signed with the DEV key; this round adds a 64 MB Skia GPU cache limit (187–237 MB less memory while playing on macOS), 99 unused libVLC plugins removed and the other chip's Skia library dropped from the Mac app. Tests: 52 desktop tests and a phone emulator smoke test pass. Size versus v1.11.3: APK +18 KB; dmg arm64 103.4 → 83.3 MB, x64 110.4 → 89.1 MB; msi 96.2 → 82.2 MB. Measured on the owner's Mac: starts faster than VLC and IINA; VLC uses less while playing. Next: the owner tests each platform and preset, then approves or reports fixes.

## Open handoffs

Fields: [Handoffs](working-method.md#handoffs).

| Source → target | Responsible session | Requirement | Acceptance | Blockers | Next action |
|---|---|---|---|---|---|
| owner → `ks-download-manager` (2026-11-28) | Claude Code, ks-download-manager (paused; starts only on the owner's authorization) | On a YouTube video page in Chrome the extension shows a visible download button, as Internet Download Manager does.<br>**Reason and evidence:** the app's approved plan already includes a one-click best-quality YouTube download through the extension; the owner sees no button today.<br>**Expected:** a small floating "Download" button anchored to the video player (not in YouTube's button row, so layout changes do not hide it); on watch pages, also after moving between videos without a reload, in theatre and full-window modes; dismissible. One click sends the video to the desktop app at the best available quality; if the app is not running, the button says so. The same button on other sites with a video player; the image hover download on X stays as it is. English and Hindi text through ks-utility.<br>**Dependency:** the current ks-utility tag at the time of work. | First find and record why the button does not show (extension not loaded, outdated build, or page detection). Then it shows within 2 seconds on 5 different YouTube videos in a row without reloading, a click starts the download in the app, and a test covers page detection. | The app is paused. | Wait for the owner to make `ks-download-manager` active. |

## Open decisions for the owner

1. **Central rule change for StreamFlix's playback:** StreamFlix will integrate JaiPlayer's playback module instead of only handing off to the app. [Cross-repository relationships](cross-repo.md) currently allows no code dependency between apps, so apps depending on a JaiPlayer module needs a central rule change, to be proposed with Claude Chat's specification.
2. **The scope of StreamFlix's approved plan.**

## Apps

| App | Latest production | ks-utility | State |
|---|---|---|---|
| `ks-jaiplayer` | v1.11.3 (plus `windows-v1.8.0`) | v0.19.0 on `dev` | **active group** |
| `ks-beam` | v1.7.2 | v0.18.4 | paused |
| `ks-tv-launcher` | `google-tv-v0.12.4` | v0.18.4 | paused |
| `ks-vault` | `android-v1.4.6` | v0.18.4 | paused |
| `ks-expense-manager` | `android-v0.5.4` | v0.18.4 | paused |
| `ks-download-manager` | v0.4.1 | v0.18.4 | paused |
| `ks-forge` | v0.2.3 | v0.18.4 | paused |
| `ks-streamflix` | v1.3.1 | v0.18.4 on `dev` | **active group**; **v1.4.0 not released** |

The initial rollout on ks-utility v0.18.4 (no approval needed) finished for seven apps. StreamFlix's `v1.4.0` run stopped at "the tagged commit is not on `main`", so nothing was published. The tag stays (tags are never moved); releasing it needs `main` fast-forwarded to the tagged commit and the run re-run, or a new tag, and waits for the owner's decision now that StreamFlix is in the active group.

Paused apps' own to-dos (the DEV variant, clean PROD data, the approval wording in their docs) are in each app's notes and are picked up when the app becomes active.

## Owner steps pending

- **DEV keystore:** create it and add `DEV_KEYSTORE_BASE64`, `DEV_KEYSTORE_PASSWORD`, `DEV_KEY_ALIAS`, `DEV_KEY_PASSWORD` to each Kotlin app repository ([Release cycle](release-cycle.md#dev-and-prod-side-by-side)). Needed before that app's DEV builds can be signed.
- **Google Search Console:** the verification file is live; submit `sitemap.xml` ([Landing page](landing-page.md#search-engines)).

## Shared changes waiting to be adopted

| Change | Where | Adopted by |
|---|---|---|
| `SHA256SUMS`, ks-utility version and signing status in release notes, `environment: production` on publish, DEV build mode and DEV signing, `isDevBuild` | ks-utility v0.19.0 (tagged 2026-11-27 with the owner's approval; DEV mode not yet run in an app) | none yet; each app when active. To adopt: pass the four `DEV_*` secrets in its release caller, read `ksVariant`/`ksDevVersion` for the DEV IDs (Kotlin) or the `variant` output and `tauri.dev.conf.json` (Tauri), add the Tauri publish inputs `ks-utility` and `signing`, and have its `ks-utility-bump.yml` caller on `main` |

## Done (suite)

- ks-utility v0.19.0 released with the owner's approval.
- GitHub protection applied: `production` environment (owner as reviewer, release tags only) on every app; "Protect main" and "Protect release tags" rulesets on every app, ks-utility and ks-suite.
- Rules written: [Release cycle](release-cycle.md), [Architecture standards](architecture-standards.md), [Working method](working-method.md), [Rule architecture](rule-architecture.md).
- Landing page readable by search engines; all repositories under `kumasumit`, with descriptions and topics.
