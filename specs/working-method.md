---
type: Policy
title: Working method
description: One development group at a time, one session per repository with handoffs between them, how findings become rules, token-efficient sessions and checkpoints.
tags: [policy, process, sessions, knowledge, graphify]
---

# Working method

Owner's rules (2026-11-27, group and sessions 2026-11-28), for every Claude session in the suite.

## One development group at a time

- Only the **active group** (in [Progress](progress.md)) is developed, tested or released: `ks-utility`, `ks-jaiplayer` and `ks-streamflix`. Every other app is paused: not started, inspected, refactored, built or released without the owner's explicit instruction. No suite-wide audits.
- Group members may work independently when their tasks do not conflict, duplicate functionality or waste usage; StreamFlix server work is not blocked by unrelated JaiPlayer work. No duplicate playback engines or shared utilities.
- A ks-utility change made for the group is recorded in [Progress](progress.md) for the apps that adopt it later, when each becomes active. Paused apps are not developed, rebuilt or released meanwhile. The one exception is ks-utility's automatic move (owner's decision, 2026-11-27): its bump workflow may still push a tested `chore: move ks-utility` commit to a paused app's `dev`; it never releases anything, and the app adopts the rest when it becomes active.
- **Completion gate:** no next app or group starts until the ks-utility work the group needs is released; JaiPlayer's and StreamFlix's approved plans are tested, approved and released; the shared playback integration is validated; the docs are updated; reusable findings are evaluated ([Findings to rules](#findings-to-rules)); and no release blocker remains. Then the sessions give one consolidated report and wait for the owner, who picks what comes next.

## Sessions and ownership

- **Claude Chat:** architecture, specs, plans, reviews and rule proposals. It never modifies a repository.
- **One Claude Code session per repository:** `ks-suite` (central governance only, idle unless needed), `ks-utility`, `ks-jaiplayer`, `ks-streamflix`. Only the owning session changes, builds, tests, commits or releases its repository, with no bypass through subagents, scripts, MCP tools or the GitHub API.
- Reading another repository is allowed only when needed, targeted and read-only; prefer its specs and contracts.
- **Models (the owner's guidance):** Fable for architecture, Sonnet Medium for apps, Sonnet Low for governance, Opus only for exceptional problems. The owner selects model and effort; a session may recommend escalation, never switch.

## Handoffs

A need in another repository is written as a handoff, and the requesting session waits for the owning session. A handoff states: source, target, responsible session, requirement, reason and evidence, expected interface or behaviour, acceptance criteria, dependency or version, blockers, and next action. Open handoffs are listed in [Progress](progress.md#open-handoffs).

## Findings to rules

The owning session documents a finding, with evidence and measurements, in its own repository. Claude Chat classifies it (app, platform, shared module or suite) and proposes a rule only for a verified benefit. After the owner's approval the ks-suite session records it. Other apps adopt it when they become active, never by an automatic rebuild.

## Significant features

Claude Chat writes the spec and plan; the owning session records it, implements, tests and documents it; Claude Chat reviews deviations; then the [release cycle](release-cycle.md) applies unchanged. A documented investigation is not repeated without new evidence.

## Knowledge and context

Knowledge management exists to cut effort and tokens; it is never a project of its own (owner, 2026-11-27). Markdown in `specs/` first; nothing else is added unless it measurably saves work.


- **Where knowledge lives:** suite rules in KS-Suite `specs/` (start at its [index](index.md)); each app's architecture, storage, platforms, tests, decisions, known issues and progress in that app's own `specs/` (its `index.md`, and a `progress.md`). No second documentation tree; facts are written once and linked.
- **Code navigation:** targeted search (`grep`, file names) by default. Graphify is optional: used only in a repository where it has been checked to work and to actually save tokens there; otherwise it is not maintained or required. No full-repository scans, no paid or cloud graph services.
- **Source of truth:** the code, configuration and test results. A spec or graph that may be stale is checked against them.

## A session's start

1. Read the root `CLAUDE.md` and this repository's `specs/index.md`.
2. Read [Progress](progress.md): the active group, its last checkpoint and open handoffs.
3. Read this repository's `specs/index.md` and `progress.md`.
4. Find the files for the task with a targeted search (or graphify where it is proven useful), and read only those.
5. Continue from the recorded next action.

## Checkpoints

Before a session ends, and at every approval gate, its repository's `progress.md` (and its row in [Progress](progress.md)) records: phase, work done, pending tasks, decisions, files changed, commit, test results, DEV build links, pull request, blockers and the exact next action.

## Economy

Incremental changes over rewrites; no re-reading unchanged files; short reports; targeted builds and tests while developing, full validation before a DEV build or release; few GitHub Actions runs (watch with `gh run watch --interval 60`, the account's API limit is shared). Local scripts for repetitive work; logs filtered locally; no large logs, binaries or generated files in context; no unneeded web searches, MCP calls or polling; no new paid API, subscription or service without the owner's approval. Never skip security, migration, regression or release checks to save tokens.
