# KS-Suite workspace

Seven independent apps, each its own git repo, plus `ks-utility`, a repo of generic utility code. Six apps are Kotlin apps; `ks-download-manager` is a desktop-only Rust/Tauri app. This file holds suite-wide rules; each repo's own `CLAUDE.md` holds its stack, constraints, and commands. Read that one before working in a repo.

## Specs
- All suite-wide specs live in `specs/` in the repository root, as an Open Knowledge Format (OKF) v0.2 bundle. Each app keeps its own specs in its repo's `specs/`. Start at `specs/index.md`.
- One topic per file. Every file except `index.md` and `log.md` starts with YAML frontmatter: `type` (required: `Specification`, `Policy`, `Plan`, `Playbook` or `Reference`), `title`, `description` (one sentence), `tags`.
- When a spec is added: list it in `specs/index.md` with its description. When a spec is added or changed: add a line under today's date (`# YYYY-MM-DD`, newest first) in `specs/log.md`.
- Link between specs with relative markdown links (`[Dependencies](dependencies.md)`), so they also work on GitHub.
- Links to another repository use the full GitHub URL; relative links are only for files inside this repository.

## Rules that apply to every repo
- Exception: `ks-download-manager` has no Android version, so the Kotlin, Gradle and package-root rules below do not apply to it. Its own `CLAUDE.md` defines its stack. All other rules (signing material, tag versions, Conventional Commits, no analytics or ads) still apply.
- Kotlin only. Gradle Kotlin DSL (`*.gradle.kts`) with a version catalog at `gradle/libs.versions.toml`. JDK 17.
- Package root is `com.ks.<app>`.
- Never commit or print signing material: `keystore.properties`, `*.jks`, `*.keystore`, or the `SIGNING_*` env vars.
- A new app repository gets its signing secrets first: before any code, CI or release work, the owner sets the four secrets from the suite keystore (alias `ks-release`) and they are checked. See `specs/versioning-signing.md`, "A new repository: signing first".
- Version numbers come from git tags (`vMAJOR.MINOR.PATCH`) via `-PversionName` and `-PversionCode`. Never hardcode them in `build.gradle.kts`. See `specs/versioning-signing.md`.
- Commits follow Conventional Commits (`feat:`, `fix:`, `feat!:`, `chore:`).
- No analytics, crash-reporting, or ad SDKs in any app.
- Every app supports English and Hindi through `ks-utility`: interface text in its language files (`en.json`, `hi.json`) with the shared catalogue, the suite's language rule (follow the system, allow a choice, remember it), the Hindi style guide, and the language-file check in the app's tests. See ks-utility's `specs/languages.md`.
- Shared code lives only in `ks-utility`, and only when it is generic: reused across apps, with no application-specific logic. Every app takes `ks-utility` as a dependency pinned to a version tag (lock files and submodule entries keep the exact commit): the Kotlin apps as a git submodule at `ks-utility/` included with `includeBuild("ks-utility/kotlin")`, `ks-download-manager` as git dependencies in `package.json` and `src-tauri/Cargo.toml`. Never edit the submodule copy inside an app; change `ks-utility` itself, then move the app's pin. See `specs/cross-repo.md` and `ks-utility/CLAUDE.md`.
- `ks-utility` versioning: tags are `vMAJOR.MINOR.PATCH`; while in `0.x` a new helper or a behaviour change raises MINOR and a fix raises PATCH. A pushed tag is never moved or deleted; a mistake gets a new tag. Apps move to a newer tag deliberately, in their own commit. Publishing to public registries (crates.io, npm, Maven Central) is a future step, deferred until the helpers are stable. Details: ks-utility's `specs/usage.md`.
- Every repo has the graphify setup (`.claude/`, and a `graphify` section in its `CLAUDE.md`). `graphify-out/` is generated and git-ignored. `ks-tv-launcher` uses its own code graph (`scripts/kb.py`) instead.
- Every app repo has the same platform folders: `tv/google-tv/`, `desktop/mac/`, `desktop/windows/`, `mobile/android/` and `mobile/ios/`. All five exist in every app repo, even for platforms the app does not target. Code for one platform goes in its folder; code used by two or more platforms of the same app goes in `shared/` in that repo's root (fixed name), written once and never copied between platform folders; generic code used by several apps goes in `ks-utility`. `ks-utility` is a helpers repo and keeps its own layout. See `specs/platform-folders.md`.
- Each platform build of every app is optimized for its own OS (engine, rendering, input, look, OS integrations), with as few dependencies as possible and nothing the user must install; genuinely shared code stays in `shared/`. Each app keeps a per-platform plan in its `specs/`. See `specs/platform-folders.md`.
- Branches: only `dev` and `main` in every repo. Commit all work on `dev`; `main` only fast-forwards to `dev` at a release; start new work from `dev` brought up to date with `main`; never create another branch, and delete any that exists once its work is on `dev`. See `specs/release-cycle.md`.
- Changes are scoped to one repo. If a change touches a cross-repo contract (`specs/cross-repo.md`), update the docs on both sides.

## Working efficiently (keep token use low)
- Use the knowledge graph first: follow the rules in the `graphify` section at the end of this file. [graphify](https://github.com/Graphify-Labs/graphify) is a development tool only; it is never a dependency of the code and is never bundled or shipped.
- One-time setup on a new machine (owner): `uv tool install graphifyy` (the package name has two y's), then `/graphify .` in Claude Code. The setup in `.claude/` is committed; `graphify-out/` is generated and git-ignored.
- Read only the specs the task needs, and do not re-read a file that has not changed in this session.
- Never read generated files: the app folders' build output (`build/`, `.gradle/`, `node_modules/`, `target/`), `graphify-out/graph.json`.
- Keep command output short (show only failures), and keep summaries brief.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- `graphify-out/` is generated and git-ignored: never commit it.
