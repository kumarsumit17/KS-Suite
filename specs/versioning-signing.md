---
type: Policy
title: Versioning and signing
description: Tag-driven SemVer, the version fields derived from the tag, CI signing from repository secrets, and the release pipeline stages.
tags: [versioning, signing, release, ci]
---

# CI/CD: semantic versioning and automated signing

Every Kotlin app repository ships the same GitHub Actions pipeline in `.github/workflows/release.yml`. `ks-download-manager` (Rust/Tauri) has its own release workflow with the same cycle ([release steps](https://github.com/kumarsumit17/ks-download-manager/blob/main/docs/release.md)).

The cycle around a release (test on `dev`, merge to `main`, push the tag, the workflow publishes) is in [Release cycle](release-cycle.md).

## 1. Versioning (SemVer 2.0)

- Versions follow `MAJOR.MINOR.PATCH`:
  - **MAJOR** for breaking changes or data migrations that can't be reversed
  - **MINOR** for backward-compatible features
  - **PATCH** for bug fixes
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `feat!:`, `chore:`…), so the next version and the release notes can be derived from history.
- A release is triggered by pushing an annotated tag:

  ```bash
  git tag -a v1.4.2 -m "v1.4.2"
  git push origin v1.4.2
  ```

- The workflow derives both Android version fields from the tag:

  | Field | Formula | `v1.4.2` → |
  |---|---|---|
  | `versionName` | tag without the `v` | `1.4.2` |
  | `versionCode` | `MAJOR × 10000 + MINOR × 100 + PATCH` | `10402` |

  They are passed to Gradle as `-PversionName` / `-PversionCode`. MINOR and PATCH must stay below 100.

## 2. Automated Signing

Keystores **never** enter source control. `*.jks`, `*.keystore`, and `keystore.properties` are git-ignored in every repo.

Configure these **repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Contents |
|---|---|
| `KEYSTORE_BASE64` | `base64 -i release.jks` output |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Signing key alias |
| `KEY_PASSWORD` | Signing key password |

At build time the workflow decodes the keystore into `$RUNNER_TEMP` and exposes it through `SIGNING_*` environment variables. It deletes the keystore when the job finishes, even if the job fails. Gradle reads the variables like this:

```kotlin
signingConfigs {
    create("release") {
        storeFile = System.getenv("SIGNING_STORE_FILE")?.let(::file)
        storePassword = System.getenv("SIGNING_STORE_PASSWORD")
        keyAlias = System.getenv("SIGNING_KEY_ALIAS")
        keyPassword = System.getenv("SIGNING_KEY_PASSWORD")
    }
}
```

For local release builds, keep the same four values in an untracked `keystore.properties`.

## 3. Pipeline Stages

```
tag push v*.*.*
   │
   ├─▶ checkout → JDK 17 → Gradle cache
   ├─▶ derive versionName / versionCode from tag
   ├─▶ decode keystore from secrets
   ├─▶ build signed APK + AAB          (jaiplayer also builds Windows .msi/.exe and macOS .dmg)
   ├─▶ publish the GitHub Release (full release, latest) once every build and check passed
   └─▶ wipe keystore
```
