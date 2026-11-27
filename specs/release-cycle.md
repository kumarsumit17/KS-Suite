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
- **DEV builds** are made by the release workflow on `dev` for every platform a change touches. They are the DEV variant ([DEV and PROD side by side](#dev-and-prod-side-by-side)), named with app, platform, version and commit (`ks-beam-dev-1.8.0-dev+3f2a1c9-android.apk`), and published as downloadable workflow artifacts, never as a GitHub release or prerelease, so the landing page and the apps' updaters never see them. The owner gets the download links for manual testing.
- **Testing.** CI and the automated tests pass on `dev`; the owner then installs the DEV build and tests it by hand. What the owner reports is fixed on `dev` and a new DEV build is made, until the owner is satisfied.
- **Approval.** A production release needs, all together: every requested feature done, every reported release-blocking bug fixed, automated tests green, the owner's manual test done, and the owner's **explicit approval for that app and platform**. Approval for one app or platform never covers another.
- **Release.** Only after approval: fast-forward `main` to `dev`, CI green on `main`, push the platform tag, the release workflow publishes (steps below), the published files are checked, `main` is the new baseline, and the owner is notified with the release details.
- **Never** a production release from unapproved `dev` work, and no automatic production release from an ordinary `dev` commit.

### DEV and PROD side by side

Owner's rule (2026-11-27): a DEV build installs next to the production (PROD) app on the same device and never touches it.

| Platform | DEV identity | Kept apart |
|---|---|---|
| Android, Google TV | application ID with `.dev` (`com.ks.beam` → `com.ks.beam.dev`), name with " DEV", a DEV-marked icon and TV banner | data, preferences, databases and caches (Android keeps them per application ID); a DEV APK can never update or remove PROD |
| macOS | bundle identifier with `.dev`, app name "<App> DEV" | Application Support, preferences, caches and databases under the DEV identifier; both apps sit in Applications |
| Windows | its own MSI `UpgradeCode` (and product code), name "<App> DEV", install folder and shortcuts | `%APPDATA%` / `%LOCALAPPDATA%` folder under the DEV name; installing or removing DEV leaves PROD alone |
| Chrome extension | a separate unpacked DEV extension with " DEV" in its name | its own extension ID and storage |

- **PROD stays clean** (owner's rule, 2026-11-27): no DEV data ever reaches PROD. DEV and PROD share no storage: no `sharedUserId`, no shared files, folders, databases, keychain items or content providers, no import or migration from DEV to PROD, and Android backups of one never restore into the other (separate application IDs). Test data, logins and settings made in DEV stay in DEV.
- **Each user has their own data:** every install keeps its data per OS user, never machine-wide. Android keeps it per user profile; macOS under the user's `~/Library` (Application Support, Preferences, Caches); Windows under the user's `%APPDATA%` / `%LOCALAPPDATA%`, never `ProgramData` or the install folder. Two people on one computer or one TV never see each other's data, in DEV or PROD.
- **PROD identities never change:** production application IDs, bundle identifiers, MSI upgrade codes and signing stay exactly as they are.
- **Signing (owner's choice, 2026-11-27):** DEV Android files are signed with a separate, stable DEV keystore, so each new DEV build installs as an update over the last one, (`DEV_KEYSTORE_BASE64`, `DEV_KEYSTORE_PASSWORD`, `DEV_KEY_ALIAS`, `DEV_KEY_PASSWORD` secrets), never with the production `ks-release` key; macOS and Windows DEV builds are unsigned.
- **Updates:** a DEV build checks only for DEV builds or not at all; it never offers a production file.
- **Checks:** side-by-side install is checked on the emulators and the Mac where possible; on a real phone, TV or Windows PC it is reported as pending the owner's check, never claimed.

### The release pull request

When the DEV builds are tested, the session opens a pull request from `dev` to `main` listing the tested DEV builds (commits and links). The owner's approval of that pull request, or explicit approval in the conversation, is the approval for the platforms it names. The session checks that `dev` is still exactly what was tested, then fast-forwards `main` to it (GitHub marks the pull request merged), and tags. `main` still only fast-forwards ([Branches](#branches)).

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
- **By GitHub (applied 2026-11-27 with the owner's approval):** every app repository has a `production` environment with the owner (`kumasumit`) as required reviewer, deployable only from release tags (`v*`, `android-v*`, `google-tv-v*`, `mac-v*`, `windows-v*`, `chrome-v*`); every app repository, ks-utility and ks-suite have the rulesets "Protect main" (no deletion, no force-push) and "Protect release tags" (no deletion, no moving).
- **Limit:** the environment pauses a release only once the shared publish job declares `environment: production` (ks-utility's next tag). Until then the approval gate is a process rule: sessions push a production tag only after the owner's explicit approval.

## Branches

Every KS-Suite repository (the apps, `ks-utility` and this workspace repository) has exactly two branches, `dev` and `main`, both on GitHub. No other branch is kept, locally or on GitHub.

- **All work is committed on `dev`:** features, fixes, tests, docs. There are no feature or fix branches; the only pull request is the [release pull request](#the-release-pull-request) from `dev` to `main`, which records the owner's approval.
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
