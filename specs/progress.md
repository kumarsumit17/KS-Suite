---
type: Plan
title: Progress
description: The suite's checkpoint: the active app, where each app stands, owner steps pending, and shared changes waiting to be adopted.
tags: [plan, progress, tracker]
---

# Progress

Updated 2026-11-27. How it is kept: [Working method](working-method.md).

## Active app

**`ks-jaiplayer`** (owner's choice, 2026-11-27). Phase: **waiting for the owner's DEV signing secrets** before DEV builds. Done on `dev`: audit and plan (class C confirmed: preferences per OS user, nothing to remove; plan in its `specs/plan-standards.md`), ks-utility v0.19.0 (5b6d770), the DEV variant side by side (2f7abc6, checked on the emulators and the Mac; Windows and real devices pending the owner). Size baseline from v1.11.3: APK 1.98 MB, AAB 5.19 MB, dmg 103/113 MB, msi 96.9 MB. Next: DEV builds for all platforms, then the release pull request with the DEV build report. Its checkpoint: [ks-jaiplayer `specs/progress.md`](https://github.com/kumasumit/ks-jaiplayer/blob/dev/specs/progress.md). No other app is worked on until the owner names it.

## Apps

| App | Latest production | ks-utility | State |
|---|---|---|---|
| `ks-jaiplayer` | v1.11.3 (plus `windows-v1.8.0`) | v0.19.0 on `dev` | **active** |
| `ks-beam` | v1.7.2 | v0.18.4 | paused |
| `ks-tv-launcher` | `google-tv-v0.12.4` | v0.18.4 | paused |
| `ks-vault` | `android-v1.4.6` | v0.18.4 | paused |
| `ks-expense-manager` | `android-v0.5.4` | v0.18.4 | paused |
| `ks-download-manager` | v0.4.1 | v0.18.4 | paused |
| `ks-forge` | v0.2.3 | v0.18.4 | paused |
| `ks-streamflix` | v1.3.1 | v0.18.4 on `dev` | paused; **v1.4.0 not released** |

The initial rollout on ks-utility v0.18.4 (no approval needed) finished for seven apps. StreamFlix's `v1.4.0` run stopped at "the tagged commit is not on `main`", so nothing was published. The tag stays (tags are never moved); releasing it needs `main` fast-forwarded to the tagged commit and the run re-run, or a new tag, and waits for the owner to make StreamFlix active or to say otherwise.

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
