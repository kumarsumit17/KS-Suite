# KS-Suite workspace

Six independent apps, each its own git repo. Five are Kotlin apps; `ks-download-manager` is a desktop-only Rust/Tauri app. This file holds suite-wide rules; each repo's own `CLAUDE.md` holds its stack, constraints, and commands. Read that one before working in a repo.

## Rules that apply to every repo
- Exception: `ks-download-manager` has no Android version, so the Kotlin, Gradle and package-root rules below do not apply to it. Its own `CLAUDE.md` defines its stack. All other rules (signing material, tag versions, Conventional Commits, no analytics or ads) still apply.
- Kotlin only. Gradle Kotlin DSL (`*.gradle.kts`) with a version catalog at `gradle/libs.versions.toml`. JDK 17.
- Package root is `com.ks.<app>`.
- Never commit or print signing material: `keystore.properties`, `*.jks`, `*.keystore`, or the `SIGNING_*` env vars.
- Version numbers come from git tags (`vMAJOR.MINOR.PATCH`) via `-PversionName` and `-PversionCode`. Never hardcode them in `build.gradle.kts`. See README → CI/CD.
- Commits follow Conventional Commits (`feat:`, `fix:`, `feat!:`, `chore:`).
- No analytics, crash-reporting, or ad SDKs in any app.
- Changes are scoped to one repo. If a change touches a cross-repo contract (README → Cross-Repository Relationships), update the docs on both sides.
