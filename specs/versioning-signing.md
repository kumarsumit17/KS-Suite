---
type: Policy
title: Versioning and signing
description: Tag-driven SemVer, the version fields derived from the tag, CI signing from repository secrets, and the release pipeline stages.
tags: [versioning, signing, release, ci]
---

# CI/CD: semantic versioning and automated signing

Every Kotlin app repository ships the same GitHub Actions pipeline in `.github/workflows/release.yml`. `ks-download-manager` (Rust/Tauri) has its own release workflow with the same cycle ([release steps](https://github.com/kumasumit/ks-download-manager/blob/main/docs/release.md)).

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
- An app with a separate Google TV app ([Platform folders](platform-folders.md#phone-and-google-tv-builds)) gives the TV build `versionCode + 1,000,000,000` (`v1.4.2` → `1000010402`), set in its Gradle build. Google Play needs a different `versionCode` for every bundle of one package, and the lower phone code also keeps the phone build from being installed over the TV build.

### Platform tags (own version per platform)
Owner's rule (2026-11-25, replacing the one-version rule of the same day), for every app: each release is tagged with the platform in front, `android-vX.Y.Z`, `google-tv-vX.Y.Z`, `mac-vX.Y.Z`, `windows-vX.Y.Z` or `chrome-vX.Y.Z` (a Chrome extension, ks-utility `v0.11.0`), and the formulas above apply to the part after the prefix. Such a tag builds and releases only that platform, so each platform build has its own version.
- **One-platform apps use their prefix too** (`ks-vault`, `ks-expense-manager`: `android-v…`; `ks-tv-launcher`: `google-tv-v…`), so every app's tags read the same way.
- **A plain `vX.Y.Z` still releases every platform at once.** A platform's version is the higher of its own latest tag and the latest plain tag, and each platform's next tag is higher than both.
- **A platform release is not marked latest.** Each app's updater reads the release list and takes the newest release that has its platform's file. This needs ks-utility `v0.10.0` or later: the release workflow's `platform` input, `AppUpdate.evaluateReleases` (Kotlin), `parse_releases` and `tag_prefix` (Rust).
- **Bridge release:** before its first platform tag, an app that checks for updates ships one plain `vX.Y.Z` release whose builds already read the release list, because builds installed earlier only read `releases/latest`. Each platform's first own version is higher than that release. An app with no update checker needs no bridge release.
- **The `ks-download-manager` Chrome extension** tags `chrome-vX.Y.Z` (ks-utility `v0.11.0`, which also gives the Rust and TypeScript helpers `google-tv-`).

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

### A new repository: signing first

Every app is signed with the one suite key (alias `ks-release`, certificate SHA-256 starting `2A:A2:5F:08`), so updates install over each other's releases and the apps can trust one another. A GitHub personal account has no shared Actions secrets, so **each repository needs its own copy of the four secrets**.

When a new app repository is created, its signing secrets are set and checked **first**, before any code, CI or release work, so the first tag cannot fail on signing (ks-beam's `v1.0.0` was never released because they were missing):

1. Create the repository on GitHub.
2. The owner sets the four secrets from the suite keystore. Claude never types or handles the passwords. The alias goes in without a prompt, and the password line saves the password only after `keytool` has opened the keystore with it, so a mistyped one is never stored (run it in a terminal where you can type, not in a non-interactive box):
   ```bash
   base64 -i ~/keys/ks-release.jks | gh secret set KEYSTORE_BASE64 -R kumasumit/<repo>
   gh secret set KEY_ALIAS -R kumasumit/<repo> --body ks-release
   read -s "P?Keystore password: "; echo; export P; if keytool -list -keystore ~/keys/ks-release.jks -storepass:env P -alias ks-release > /dev/null 2>&1; then printf '%s' "$P" | gh secret set KEYSTORE_PASSWORD -R kumasumit/<repo> && printf '%s' "$P" | gh secret set KEY_PASSWORD -R kumasumit/<repo>; else echo "Wrong password: nothing saved"; fi; unset P
   ```
3. Check: `gh secret list -R kumasumit/<repo>` lists all four. Once the repository has its release workflow, a rehearsal (manual run) must pass the **Decode and check keystore** step and verify the APK's signing certificate before the first tag.
4. Never change a secret while a release or rehearsal run is in progress: each job reads the secrets when it starts.

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
