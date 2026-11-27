---
type: Policy
title: Release cycle
description: The one release cycle every KS-Suite app follows: test on dev, merge to main, push the tag, and the release workflow publishes the release.
tags: [release, ci, versioning, policy]
---

# Release cycle

Every KS-Suite app releases the same way. Version numbers and signing are in [Versioning and signing](versioning-signing.md); this page is the cycle around them.

## DEV, test, approval, production

Owner's rule (2026-11-27, replacing "build, test, release, no waiting"), for every app and every platform it ships on:

```
latest production tag ─▶ dev ─▶ work ─▶ DEV build ─▶ automated tests ─▶ owner's manual test ─▶ fixes … ─▶ owner's approval ─▶ production release
```

- **Baseline.** `main` holds each app's latest production release (it only fast-forwards at a release, [Branches](#branches)), so `dev` always starts from it. A change for one platform starts from that platform's latest production tag; platforms that share code share `dev`. There are no per-platform branches.
- **Development.** Every feature, improvement and fix is made and committed on `dev`, never on `main`. Nothing untested reaches `main`.
- **DEV builds** are the release workflow's **rehearsal** (a manual run on `dev`): it builds every file exactly as a release would, signs the Android files with the suite key, and keeps them as run artifacts; it never tags, attests or publishes. DEV files are named and kept apart from production files (artifacts of a rehearsal run, never a release).
- **Testing.** CI and the automated tests pass on `dev`; the owner then installs the DEV build and tests it by hand. What the owner reports is fixed on `dev` and a new DEV build is made, until the owner is satisfied.
- **Approval.** A production release needs, all together: every requested feature done, every reported release-blocking bug fixed, automated tests green, the owner's manual test done, and the owner's **explicit approval for that app and platform**. Approval for one app or platform never covers another.
- **Release.** Only after approval: fast-forward `main` to `dev`, CI green on `main`, push the platform tag, the release workflow publishes (steps below), the published files are checked, `main` is the new baseline, and the owner is notified with the release details.
- **Never** a production release from unapproved `dev` work, and no automatic production release from an ordinary `dev` commit.

### First release of an app on a platform

The first production release of an app on a platform (a new app, or an existing app adding a platform) needs no manual test beforehand: a stable implementation, green automated tests and build checks, and the required signing are enough, and it needs no separate approval. Every later release of that app on that platform follows the full rule above.

### A new ks-utility version

A new ks-utility tag moves each app's pin on `dev` the same day ([Cross-repository relationships](cross-repo.md#moving-to-a-new-ks-utility-tag)), with the compatibility and regression tests, and a DEV build where the app changes. It never starts a production release by itself: that waits for the owner's manual test and approval like any other change. Every release records the exact ks-utility version it was built on (in the release notes). The one exception was the initial rollout of 2026-11-27, when every app released on ks-utility v0.18.4 without a separate approval.

### Signing and checksums

- **Android and Google TV:** signing with the suite key is mandatory and the release workflow verifies each APK and AAB signature before publishing; a release whose signing or verification fails is blocked. The keystore and its secrets are never replaced or regenerated ([Versioning and signing](versioning-signing.md)).
- **macOS and Windows:** unsigned `.dmg`, `.app`, `.msi` and `.exe` files are allowed; no Apple Developer ID, notarisation, Authenticode or other paid signing is required or added without the owner's approval. The workflow checks that each installer is built and complete.
- **Chrome extension and other platforms:** their existing packaging and distribution.
- **Every production release** carries a SHA-256 checksum of each file (`SHA256SUMS`), each file's GitHub build-provenance attestation, and its signing status per platform in the release notes. No key, password or secret is ever printed in a log.

### How the gate is enforced

- **By the workflow:** a release runs only from a tag on `main`; a rehearsal never publishes; `ks-suite-check` and the Android signature check stop a release that breaks a rule; pushed tags and published files are never changed.
- **By GitHub (proposed, needs the owner's approval of the settings):** a `production` environment in each app repository with the owner (`kumasumit`) as required reviewer on the release workflow's publish job, so a tag pushed by anyone else waits for the owner's click; and repository rulesets that block force-pushes and deletion of `main` and of release tags.
- **Until those settings are applied, the approval gate is a process rule only:** sessions do not push a production tag without the owner's explicit approval in the conversation, but GitHub does not technically prevent it.

## Branches

Every KS-Suite repository (the apps, `ks-utility` and this workspace repository) has exactly two branches, `dev` and `main`, both on GitHub. No other branch is kept, locally or on GitHub.

- **All work is committed on `dev`:** features, fixes, tests, docs. There are no feature or fix branches and no pull requests between branches.
- **`main` only moves by fast-forward to `dev`**, as step 2 of the cycle. Nothing is ever committed straight to `main`.
- **Starting new work:** bring `dev` up to date with `main` first (`git checkout dev && git pull --ff-only && git merge --ff-only origin/main`). Because `main` only fast-forwards to `dev`, this is normally already true; the merge only catches a `main` that moved some other way.
- **A branch made by mistake or by a tool** is fast-forwarded into `dev` (or rebased onto it) and deleted from the computer and from GitHub as soon as its work is on `dev`. A branch whose work is not on `dev` is never deleted without the owner's say, since that loses the work.
- **One writer per repository at a time:** two sessions do not commit to the same repository's `dev` at once; the second waits or works in another repository.

## The release workflow

`.github/workflows/release.yml` in each app repository, with this shape:

- **Two ways in.** A tag push makes a release. A manual run (`workflow_dispatch`) is the rehearsal: it builds and checks everything exactly as a tag would and **never publishes**. A rehearsal takes the version to build as an input.
- **Build and verify jobs are read-only** (`contents: read`). They build every release file, check it (signatures, contents, versions, licence files), and pass the files on as workflow artifacts.
- **One publish job** is the only job with write access. It runs only for a tag push, only if every job before it succeeded, checks it received exactly the expected files, and publishes them.
- **Checks before anything is built:** the tag is exactly `vMAJOR.MINOR.PATCH` or `<platform>-vMAJOR.MINOR.PATCH` (no suffix), the tagged commit is on `main`, and the version's changelog section is dated (apps with a `CHANGELOG.md`).
- **Exactly the release files** are attached, chosen by name; nothing else from the run is ever attached.
- **Build provenance:** each release file gets a GitHub build-provenance attestation on a tag run (`gh attestation verify <file> -R <owner>/<repo>`). A rehearsal makes none: an attestation is a permanent public record, and rehearsal files are never released.
- **Pinned and named:** runner images are named versions (`ubuntu-24.04`, `macos-15`, `windows-2025`), never `-latest`; every action is pinned to a full commit SHA with its version in a comment. The one exception is ks-utility's own shared workflows, called at `@main` ([Cross-repository relationships](cross-repo.md#moving-to-a-new-ks-utility-tag)). GitHub's own actions only, and the preinstalled `gh` CLI for publishing; a third-party action needs the owner's exception (see [Dependencies](dependencies.md)).
- **A failure publishes nothing.** A failed upload leaves no public release (publish through a hidden draft that becomes public only when every file is up, as `gh release create` with files does).

## Rules

- Never force-push. Never move or delete a pushed tag. Never change the files of a published release.
- Never tag while anything is red (CI on `dev` or `main`, or the rehearsal).
- A tag whose run fails stays as it is; the fix goes to `dev` and the release gets the **next PATCH** version. The changelog says which tags were never released.
- **Paid signing never blocks a release.** Apple Developer ID signing and notarisation, Windows Authenticode, and any other certificate that costs money are skipped for now and kept as a to-do in each app's specs. Free signing is always done: the suite's Android keystore and the build-provenance attestation. An unsigned dmg or msi shows a Gatekeeper or SmartScreen warning; each app's release notes or README say how to open it.
- **Manual testing comes before a release.** The owner tests the DEV build by hand before approving a production release; only an app's first release on a platform skips it ([First release](#first-release-of-an-app-on-a-platform)).
- Each app records its own decisions and its exact file list in its repository (for example ks-download-manager's [release steps](https://github.com/kumasumit/ks-download-manager/blob/main/docs/release.md)).
