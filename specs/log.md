# 2026-11-21

* **Update**: [Cross-repository relationships](cross-repo.md) and [Shared conventions](conventions.md): apps take `ks-utility` as a pinned dependency (git submodule and Gradle for the Kotlin apps, npm and Cargo git dependencies for `ks-download-manager`) instead of copying files; graphify setup added to the conventions.
* **Update**: [Cross-repository relationships](cross-repo.md) and [Shared conventions](conventions.md) now allow shared code in one place: generic utilities in the new `ks-utility` repository, copied into apps.
* **Update**: [Versioning and signing](versioning-signing.md) now says the shared release workflow is in the Kotlin app repositories; `ks-download-manager` adds its own in Stage 9.
* **Initialization**: `specs/` created as an Open Knowledge Format (OKF) v0.2 bundle with this log and `index.md`.
* **Creation**: [Cross-repository relationships](cross-repo.md), [Shared conventions](conventions.md) and [Versioning and signing](versioning-signing.md) moved here from `README.md`, which keeps a short summary and a link.
* **Creation**: [Dependencies](dependencies.md) added: third-party dependencies are kept to the minimum.
