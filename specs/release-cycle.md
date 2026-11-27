---
type: Policy
title: Release cycle
description: The one release cycle every KS-Suite app follows: test on dev, merge to main, push the tag, and the release workflow publishes the release.
tags: [release, ci, versioning, policy]
---

# Release cycle

Every KS-Suite app releases the same way. Version numbers and signing are in [Versioning and signing](versioning-signing.md); this page is the cycle around them.

## Build, test, release, no waiting

Owner's rule (2026-11-26), for every repository: every feature or fix is built, tested on the emulators or CI ([Testing on every platform](testing.md)), committed and pushed to `dev`, and released with the next tag, by the cycle below. No one's approval is asked before a tag, and nothing waits for a review. The owner's hand checks on real devices come later (step 5), never block a release, and what they find goes into the next version. Never commit or release while a test fails. A feature raises MINOR, a fix raises PATCH ([Versioning and signing](versioning-signing.md)).

## The cycle

1. **Test on `dev`.** All work is committed on `dev` ([Branches](#branches)). The app's `ks-utility` pin is the newest ks-utility tag: apps move the same day a tag is released ([Cross-repository relationships](cross-repo.md#moving-to-a-new-ks-utility-tag)), and the shared release workflow refuses a pin that is not the newest tag. CI is green on `dev`, and a **rehearsal** of the release (below) is green on `dev`. The release build is installed and tried on the emulators before every release: the phone emulator, the Google TV emulators for a TV app ([Testing on every platform](testing.md)), the Mac for macOS, and Windows through CI. The version's changelog section is dated, if the app keeps a `CHANGELOG.md`.
2. **Merge to `main`.** Fast-forward `main` to `dev` and push it. CI is green on `main`.
3. **Push the tag.** An annotated [platform tag](versioning-signing.md#platform-tags-own-version-per-platform) `<platform>-vMAJOR.MINOR.PATCH` (a plain `vMAJOR.MINOR.PATCH` releases every platform) on `main`, pushed on its own.
4. **The workflow publishes.** The tag's run builds every file, checks them, and publishes the GitHub release as a **full release, marked latest**, once every build and check has passed. There is no draft step and no one publishes by hand.
5. **Hand checks after the release.** The checks that need a person (installing on real devices, store or OS prompts) are done on the published files. Anything they find goes into the **next version**; the published release is not changed.

```
dev (CI green, rehearsal green) ──ff──▶ main (CI green) ──tag vX.Y.Z──▶ release workflow ──▶ published, latest
```

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
- **Pinned and named:** runner images are named versions (`ubuntu-24.04`, `macos-15`, `windows-2025`), never `-latest`; every action is pinned to a full commit SHA with its version in a comment. GitHub's own actions only, and the preinstalled `gh` CLI for publishing; a third-party action needs the owner's exception (see [Dependencies](dependencies.md)).
- **A failure publishes nothing.** A failed upload leaves no public release (publish through a hidden draft that becomes public only when every file is up, as `gh release create` with files does).

## Rules

- Never force-push. Never move or delete a pushed tag. Never change the files of a published release.
- Never tag while anything is red (CI on `dev` or `main`, or the rehearsal).
- A tag whose run fails stays as it is; the fix goes to `dev` and the release gets the **next PATCH** version. The changelog says which tags were never released.
- **Paid signing never blocks a release.** Apple Developer ID signing and notarisation, Windows Authenticode, and any other certificate that costs money are skipped for now and kept as a to-do in each app's specs. Free signing is always done: the suite's Android keystore and the build-provenance attestation. An unsigned dmg or msi shows a Gatekeeper or SmartScreen warning; each app's release notes or README say how to open it.
- **Hand checks never block a release.** Checks that need a person (real devices, the TV remote, store or OS prompts) happen after the release (step 5) and are kept as a to-do until done; what they find goes into the next version.
- Each app records its own decisions and its exact file list in its repository (for example ks-download-manager's [release steps](https://github.com/kumasumit/ks-download-manager/blob/main/docs/release.md)).
