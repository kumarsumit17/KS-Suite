# 2026-11-21

* **Update**: workspace `CLAUDE.md`: every app supports English and Hindi through `ks-utility` (format, shared catalogue, language rule, Hindi style guide, language-file check; ks-utility `v0.2.0`).
* **Update**: [Platform folders](platform-folders.md): code used by two or more platforms of one app goes in `shared/` (fixed name); the three layers (platform folder, `shared/`, `ks-utility`) are spelled out.
* **Creation**: [Platform folders](platform-folders.md) added: every app repository has `tv/google-tv`, `desktop/mac`, `desktop/windows`, `mobile/android` and `mobile/ios`; `ks-utility` keeps its own layout. Listed in [Shared conventions](conventions.md).
* **Update**: [Cross-repository relationships](cross-repo.md): apps pin `ks-utility` by version tag instead of a raw commit; versioning rules in ks-utility's `specs/usage.md` and the workspace `CLAUDE.md`.
* **Update**: [Index](index.md), [Cross-repository relationships](cross-repo.md) and [Versioning and signing](versioning-signing.md): links into the app repositories and `ks-utility` now use full GitHub URLs (`dev` for `ks-tv-launcher` and `ks-download-manager`, `main` for the others) instead of workspace-relative paths.
* **Update**: [Cross-repository relationships](cross-repo.md): the `ks-utility` → Kotlin apps row now says the Gradle wiring comes with each app's Gradle build, and that `ks-tv-launcher` has not committed the submodule yet.
* **Update**: [Cross-repository relationships](cross-repo.md) and [Shared conventions](conventions.md): apps take `ks-utility` as a pinned dependency (git submodule and Gradle for the Kotlin apps, npm and Cargo git dependencies for `ks-download-manager`) instead of copying files; graphify setup added to the conventions.
* **Update**: [Cross-repository relationships](cross-repo.md) and [Shared conventions](conventions.md) now allow shared code in one place: generic utilities in the new `ks-utility` repository, copied into apps.
* **Update**: [Versioning and signing](versioning-signing.md) now says the shared release workflow is in the Kotlin app repositories; `ks-download-manager` adds its own in Stage 9.
* **Initialization**: `specs/` created as an Open Knowledge Format (OKF) v0.2 bundle with this log and `index.md`.
* **Creation**: [Cross-repository relationships](cross-repo.md), [Shared conventions](conventions.md) and [Versioning and signing](versioning-signing.md) moved here from `README.md`, which keeps a short summary and a link.
* **Creation**: [Dependencies](dependencies.md) added: third-party dependencies are kept to the minimum.
