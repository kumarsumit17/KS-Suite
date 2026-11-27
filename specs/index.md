---
okf_version: "0.2"
---

# Policies

* [Shared conventions](conventions.md) - The conventions every KS-Suite repository follows, and where shared code is allowed.
* [Versioning and signing](versioning-signing.md) - Tag-driven SemVer, the version fields derived from the tag, CI signing from repository secrets, and the release pipeline stages.
* [Release cycle](release-cycle.md) - The one release cycle every KS-Suite app follows: test on dev, merge to main, push the tag, and the release workflow publishes the release.
* [Dependencies](dependencies.md) - Third-party dependencies are kept to the minimum; the order of preference and what must be reported for each new one.
* [Architecture, security and storage standards](architecture-standards.md) - How every KS-Suite app is built: minimal, local-first, zero-cost, with security and storage proportionate to its data, classified per app.
* [Working method](working-method.md) - One app at a time, token-efficient sessions that load only what the task needs, and checkpoints so the next session resumes without re-analysis.
* [Rule architecture](rule-architecture.md) - Where each KS-Suite rule lives: rules code can carry live in ks-utility as code and a conformance check, process rules live only in KS-Suite specs, and each rule has exactly one home.
* [Platform folders](platform-folders.md) - The platform folders every KS-Suite app repository has, which platforms each app targets, and the shared/ folder for code several platforms use.

# Plans

* [Progress](progress.md) - The suite's checkpoint: the active app, where each app stands, owner steps pending, and shared changes waiting to be adopted.
* [Per-platform optimization rollout](plan-per-platform.md) - The order in which every KS-Suite app audits, plans and tunes each platform build for its own OS, the gaps to check in each, and where each app stands.

# Playbooks

* [Testing on every platform](testing.md) - How each KS-Suite app is built, run and tested on each platform it targets from the owner's Apple-silicon Mac, with emulators for Android and Google TV, CI for Windows, and Chrome for the extension.

# Specifications

* [Landing page](landing-page.md) - The KS-Suite landing page in site/, drawn from site/apps.json with downloads from the GitHub releases API, served by GitHub Pages.

# Reference

* [Cross-repository relationships](cross-repo.md) - How the KS-Suite apps link to each other through user-started Android intents, and the contract on each edge.

# Apps

Each app is its own git repository with its own bundle; these links point to each app's repository on GitHub.

* [ks-tv-launcher](https://github.com/kumasumit/ks-tv-launcher/blob/dev/specs/index.md) - The specs of `ks-tv-launcher`.
* [ks-jaiplayer](https://github.com/kumasumit/ks-jaiplayer/blob/main/specs/index.md) - The specs of `ks-jaiplayer`.
* [ks-streamflix](https://github.com/kumasumit/ks-streamflix/blob/main/specs/index.md) - The specs of `ks-streamflix`.
* [ks-vault](https://github.com/kumasumit/ks-vault/blob/main/specs/index.md) - The specs of `ks-vault`.
* [ks-expense-manager](https://github.com/kumasumit/ks-expense-manager/blob/main/specs/index.md) - The specs of `ks-expense-manager`.
* [ks-download-manager](https://github.com/kumasumit/ks-download-manager/blob/dev/specs/index.md) - The specs of `ks-download-manager`.
* [ks-beam](https://github.com/kumasumit/ks-beam/blob/dev/specs/index.md) - The specs of `ks-beam`, which casts from Android, Windows and macOS to TVs and projectors.
* [ks-forge](https://github.com/kumasumit/ks-forge/blob/dev/specs/index.md) - The specs of `ks-forge`, a fast, private terminal for macOS and Windows.

# Shared code

* [ks-utility](https://github.com/kumasumit/ks-utility/blob/main/specs/index.md) - The specs of `ks-utility`, the generic utilities every app depends on.
