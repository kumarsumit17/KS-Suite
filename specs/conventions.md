---
type: Policy
title: Shared conventions
description: The conventions every KS-Suite repository follows, and where shared code is allowed.
tags: [conventions, policy]
---

# Shared conventions


| Concern | Convention | Defined in |
|---|---|---|
| Language / build | Kotlin, Gradle KTS, version catalog, JDK 17. Exception: `ks-download-manager` (desktop only) uses Rust, Tauri and TypeScript | root `CLAUDE.md` |
| Package root | `com.ks.<app>` | root `CLAUDE.md` |
| TV UX | D-pad first, 48dp/27dp overscan margins | `ks-tv-launcher`, `ks-streamflix`, `ks-jaiplayer` `CLAUDE.md` |
| Privacy | No analytics/ads SDKs; vault and expense apps have no `INTERNET` permission | each `CLAUDE.md` |
| Shared code | Only generic utilities, kept in `ks-utility`; every app takes it as a dependency pinned to a commit; application-specific logic stays in the app | [Cross-repository relationships](cross-repo.md), `ks-utility` `CLAUDE.md` |
| AI-assisted work | graphify setup committed in every repo (`.claude/`), `graphify-out/` git-ignored; `ks-tv-launcher` uses its own `scripts/kb.py` graph | each `CLAUDE.md` |
| Release | Tag-driven SemVer and CI signing | [Versioning and signing](versioning-signing.md) |

The rules themselves are listed in the root `CLAUDE.md`.
