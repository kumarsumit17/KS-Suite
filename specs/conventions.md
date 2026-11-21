---
type: Policy
title: Shared conventions
description: The conventions every KS-Suite repository follows, without sharing code.
tags: [conventions, policy]
---

# Shared conventions (not shared code)


| Concern | Convention | Defined in |
|---|---|---|
| Language / build | Kotlin, Gradle KTS, version catalog, JDK 17. Exception: `ks-download-manager` (desktop only) uses Rust, Tauri and TypeScript | root `CLAUDE.md` |
| Package root | `com.ks.<app>` | root `CLAUDE.md` |
| TV UX | D-pad first, 48dp/27dp overscan margins | `ks-tv-launcher`, `ks-streamflix`, `ks-jaiplayer` `CLAUDE.md` |
| Privacy | No analytics/ads SDKs; vault and expense apps have no `INTERNET` permission | each `CLAUDE.md` |
| Release | Tag-driven SemVer and CI signing | [Versioning and signing](versioning-signing.md) |

The rules themselves are listed in the root `CLAUDE.md`.
