---
okf_version: "0.2"
---

# Policies

* [Shared conventions](conventions.md) - The conventions every KS-Suite repository follows, and where shared code is allowed.
* [Versioning and signing](versioning-signing.md) - Tag-driven SemVer, the version fields derived from the tag, CI signing from repository secrets, and the release pipeline stages.
* [Dependencies](dependencies.md) - Third-party dependencies are kept to the minimum; the order of preference and what must be reported for each new one.
* [Platform folders](platform-folders.md) - The platform folders every KS-Suite app repository has, which platforms each app targets, and the shared/ folder for code several platforms use.

# Reference

* [Cross-repository relationships](cross-repo.md) - How the KS-Suite apps link to each other through user-started Android intents, and the contract on each edge.

# Apps

Each app is its own git repository with its own bundle; these links point to each app's repository on GitHub.

* [ks-tv-launcher](https://github.com/kumarsumit17/ks-tv-launcher/blob/dev/specs/index.md) - The specs of `ks-tv-launcher`.
* [ks-jaiplayer](https://github.com/kumarsumit17/ks-jaiplayer/blob/main/specs/index.md) - The specs of `ks-jaiplayer`.
* [ks-streamflix](https://github.com/kumarsumit17/ks-streamflix/blob/main/specs/index.md) - The specs of `ks-streamflix`.
* [ks-vault](https://github.com/kumarsumit17/ks-vault/blob/main/specs/index.md) - The specs of `ks-vault`.
* [ks-expense-manager](https://github.com/kumarsumit17/ks-expense-manager/blob/main/specs/index.md) - The specs of `ks-expense-manager`.
* [ks-download-manager](https://github.com/kumarsumit17/ks-download-manager/blob/dev/specs/index.md) - The specs of `ks-download-manager`.

# Shared code

* [ks-utility](https://github.com/kumarsumit17/ks-utility/blob/main/specs/index.md) - The specs of `ks-utility`, the generic utilities every app depends on.
