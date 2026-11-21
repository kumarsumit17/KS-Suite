# KS-Suite workspace

Six independent apps, each its own git repo, plus `ks-utility`, a repo of generic utility code. Five apps are Kotlin apps; `ks-download-manager` is a desktop-only Rust/Tauri app. This file holds suite-wide rules; each repo's own `CLAUDE.md` holds its stack, constraints, and commands. Read that one before working in a repo.

## Specs
- All suite-wide specs live in `specs/` in the repository root, as an Open Knowledge Format (OKF) v0.2 bundle. Each app keeps its own specs in its repo's `specs/`. Start at `specs/index.md`.
- One topic per file. Every file except `index.md` and `log.md` starts with YAML frontmatter: `type` (required: `Specification`, `Policy`, `Plan`, `Playbook` or `Reference`), `title`, `description` (one sentence), `tags`.
- When a spec is added: list it in `specs/index.md` with its description. When a spec is added or changed: add a line under today's date (`# YYYY-MM-DD`, newest first) in `specs/log.md`.
- Link between specs with relative markdown links (`[Dependencies](dependencies.md)`), so they also work on GitHub.

## Rules that apply to every repo
- Exception: `ks-download-manager` has no Android version, so the Kotlin, Gradle and package-root rules below do not apply to it. Its own `CLAUDE.md` defines its stack. All other rules (signing material, tag versions, Conventional Commits, no analytics or ads) still apply.
- Kotlin only. Gradle Kotlin DSL (`*.gradle.kts`) with a version catalog at `gradle/libs.versions.toml`. JDK 17.
- Package root is `com.ks.<app>`.
- Never commit or print signing material: `keystore.properties`, `*.jks`, `*.keystore`, or the `SIGNING_*` env vars.
- Version numbers come from git tags (`vMAJOR.MINOR.PATCH`) via `-PversionName` and `-PversionCode`. Never hardcode them in `build.gradle.kts`. See `specs/versioning-signing.md`.
- Commits follow Conventional Commits (`feat:`, `fix:`, `feat!:`, `chore:`).
- No analytics, crash-reporting, or ad SDKs in any app.
- Shared code lives only in `ks-utility`, and only when it is generic: reused across apps, with no application-specific logic. Apps copy a utility in; they never depend on `ks-utility` at build time or run time. Its own `CLAUDE.md` has the rules.
- Changes are scoped to one repo. If a change touches a cross-repo contract (`specs/cross-repo.md`), update the docs on both sides.
