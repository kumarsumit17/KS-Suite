---
type: Policy
title: Rule architecture
description: Where each KS-Suite rule lives: rules code can carry live in ks-utility as code and a conformance check, process rules live only in KS-Suite specs, and each rule has exactly one home.
tags: [policy, rules, ks-utility, conformance]
---

# Rule architecture

Owner's decision (2026-11-27): every shared rule that code can carry comes from `ks-utility`; only what code cannot carry lives in KS-Suite. Each rule has one home.

## Rules enforced by code: in ks-utility

A rule a program can apply or check lives in [`ks-utility`](https://github.com/kumasumit/ks-utility) as code: helpers, the shared release workflows, shared build settings, and a conformance check, **`ks-suite-check`**, that every app runs in CI and that fails the build when the app breaks a rule. An app gets a new or changed rule by moving its `ks-utility` pin ([Cross-repository relationships](cross-repo.md)).

Since ks-utility `v0.15.0`, `ks-suite-check` ([its spec](https://github.com/kumasumit/ks-utility/blob/main/specs/suite-check.md)) checks these, and a release that breaks one is stopped. Rules that belong here:

- The macOS updater quits the app after opening the `.dmg`, so Finder can replace it (ks-utility `DesktopInstaller` / `app_update::install::open`, v0.15.0 and later).
- Language files (`en.json`, `hi.json`), the shared catalogue and the Hindi check.
- Versions from tags (plain and [platform tags](versioning-signing.md#platform-tags-own-version-per-platform)).
- No analytics, advertising or crash-reporting SDKs.
- No default framework icon in any build ([App icons](conventions.md#app-icons)).
- The five platform folders ([Platform folders](platform-folders.md)).
- The app uses ks-utility's updater (the only exception: `ks-suite-check.json` with `no-updater` and the reason).
- The app's ks-utility pin is the newest tag, and it calls ks-utility's shared workflows at `@main` ([Cross-repository relationships](cross-repo.md#moving-to-a-new-ks-utility-tag)).

## Process rules: in KS-Suite

A rule about how people and sessions work, which no build can check, lives only in KS-Suite's specs and `CLAUDE.md`, and applies the moment it is written, with no pin to move:

- Branches (`dev` and `main`) and the [Release cycle](release-cycle.md), including build, test, release, no waiting.
- Conventional Commits.
- Each platform build optimized for its own OS ([Platform folders](platform-folders.md#each-platform-build-is-optimized-for-its-os)).
- Icons beyond the default files `ks-suite-check` recognises: a resized or older framework logo is caught only by looking at the built app ([App icons](conventions.md#app-icons)).
- Signing secrets first for a new repository; never commit signing material ([Versioning and signing](versioning-signing.md)).
- One Claude session per repository; sessions notify the owner when something waits on the owner or a task is finished.

## One home per rule

- A rule is written in full in one place only. Where KS-Suite mentions a rule enforced by code, it is a one-line **pointer**, for example "Enforced by ks-utility `appupdate` (v0.15.0 and later)", never a copy of the details.
- When ks-utility ships the code for a rule that KS-Suite still describes in full, that text in `CLAUDE.md` and the specs becomes a pointer in the same change that records the new ks-utility version.
- A rule that is partly code and partly process is split: the checkable part in ks-utility, the rest in KS-Suite with a pointer to the code.
