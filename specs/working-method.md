---
type: Policy
title: Working method
description: One app at a time, token-efficient sessions that load only what the task needs, and checkpoints so the next session resumes without re-analysis.
tags: [policy, process, sessions, knowledge, graphify]
---

# Working method

Owner's rules (2026-11-27), for every Claude Code session in the suite.

## One app at a time

- Only the **active app** (in [Progress](progress.md)) is developed, tested or released, with ks-utility changed only where it needs. No parallel work on other apps, no parallel agents per app, no suite-wide audits.
- The active app is finished only when its applicable [standards](architecture-standards.md) and requested changes are done, tests pass, the owner has tested its DEV builds, approved its release pull request, and its production releases are published and verified. Then work stops and the owner is notified. The owner picks the next app; nothing starts by itself, and nothing starts while the active app waits for testing or approval.
- A ks-utility change made for the active app is recorded in [Progress](progress.md) for the apps that adopt it later, when each becomes active. Other apps are not developed, rebuilt or released meanwhile. The one exception is ks-utility's automatic move (owner's decision, 2026-11-27): its bump workflow may still push a tested `chore: move ks-utility` commit to a paused app's `dev`; it never releases anything, and the app adopts the rest when it becomes active.

## Knowledge and context

- **Where knowledge lives:** suite rules in KS-Suite `specs/` (start at its [index](index.md)); each app's architecture, storage, platforms, tests, decisions, known issues and progress in that app's own `specs/` (its `index.md`, and a `progress.md`). No second documentation tree; facts are written once and linked.
- **Code navigation:** graphify where set up (`graphify query`, `path`, `explain`, `section`); targeted search otherwise. No full-repository scans, no paid or cloud graph services.
- **Source of truth:** the code, configuration and test results. A spec or graph that may be stale is checked against them.

## A session's start

1. Read the root `CLAUDE.md` and this repository's `specs/index.md`.
2. Read [Progress](progress.md): the active app and its last checkpoint.
3. Read that app's `specs/index.md` and `progress.md`.
4. Find the files for the task with graphify or a targeted search, and read only those.
5. Continue from the recorded next action.

## Checkpoints

Before a session ends, and at every approval gate, the active app's `progress.md` (and the suite row in [Progress](progress.md)) records: phase, work done, pending tasks, decisions, files changed, commit, test results, DEV build links, pull request, blockers and the exact next action.

## Economy

Incremental changes over rewrites; no re-reading unchanged files; short reports; targeted builds and tests while developing, full validation before a DEV build or release; few GitHub Actions runs (watch with `gh run watch --interval 60`, the account's API limit is shared). Never skip security, migration, regression or release checks to save tokens.
