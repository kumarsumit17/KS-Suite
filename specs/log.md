# 2026-11-28

* **Update**: [Cross-repository relationships](cross-repo.md), [Release cycle](release-cycle.md) and `CLAUDE.md`: every app follows the DEV process for ks-utility (try a ks-utility `dev` commit in a DEV build, release only on the newest tag).

* **Update**: [Progress](progress.md): ks-jaiplayer's newer, smaller DEV builds for release pull request #6.

# 2026-11-27

* **Update**: [Progress](progress.md): ks-jaiplayer release pull request #6 open, waiting for the owner.
* **Update**: [Working method](working-method.md) and `CLAUDE.md`: knowledge management stays minimal (Markdown first); graphify only where checked to save tokens.
* **Update**: [Progress](progress.md): ks-jaiplayer audit, plan and DEV variant done; waiting for the DEV signing secrets.
* **Update**: [Working method](working-method.md): ks-utility's automatic moves stay on for paused apps (`dev` only, never a release).
* **Update**: [Progress](progress.md): ks-utility v0.19.0 released.
* **Update**: [Progress](progress.md): what each app adopts from ks-utility's next tag.
* **New**: [Architecture, security and storage standards](architecture-standards.md) (zero cost, classes A/B/C with every app classified, storage, encryption, authentication, backups, `.ksbackup`, import/export, migrations, performance baselines, tests), [Working method](working-method.md) (one app at a time, token-efficient sessions, checkpoints) and [Progress](progress.md) (active app: `ks-jaiplayer`).
* **Update**: [Release cycle](release-cycle.md) and `CLAUDE.md`: stale approval, DEV build report, the release pull request stays open and is never merged by a session, explicit backup-file crossing between PROD and DEV.
* **Update**: [Release cycle](release-cycle.md) and `CLAUDE.md`: PROD stays clean (no shared storage, no import from DEV); each OS user has their own data; the stable DEV keystore is the owner's choice.
* **Update**: [Release cycle](release-cycle.md) and `CLAUDE.md`: DEV and PROD side by side (separate IDs, names, icons, data, DEV signing key; DEV builds as workflow artifacts, never releases); the release pull request; GitHub enforcement applied (production environment with the owner as reviewer, rulesets on `main` and release tags).
* **Update**: [Release cycle](release-cycle.md), `CLAUDE.md`, [Cross-repository relationships](cross-repo.md), [Rule architecture](rule-architecture.md): owner's rule replacing "build, test, release, no waiting": DEV from the latest production release, DEV builds (rehearsals), automated and manual testing, the owner's explicit approval per app and platform before a production release; first-release and initial-rollout exceptions; ks-utility versions never trigger a release; Android signing mandatory, macOS and Windows may be unsigned; `SHA256SUMS` and the ks-utility version in every release; the proposed GitHub enforcement.
* **Update**: [Landing page](landing-page.md) "Repository page": every app repository has a description, this page as its Website, and topics.
* **Update**: [Landing page](landing-page.md) "Repository page": the repository's description and 20 topics.
* **Update**: [Landing page](landing-page.md) "Search engines": the app list is written into the page as plain HTML with structured data and a sitemap at every deploy, for crawlers that do not run JavaScript; canonical and social tags. README's app table lists all eight apps.
* **Update**: [Cross-repository relationships](cross-repo.md) and `CLAUDE.md`: ks-utility tags at most once a day (urgent security fixes excepted); the newest-tag check stays strict (owner's decision).
* **Update**: [Cross-repository relationships](cross-repo.md): ks-utility v0.18.0 requires `@main` (a rehearsal may use `@dev`); the bump runs only once its caller is on `main`.
* **Update**: [Cross-repository relationships](cross-repo.md), [Release cycle](release-cycle.md), [Rule architecture](rule-architecture.md) and `CLAUDE.md`: apps call ks-utility's shared workflows at `@main` (always its newest release); no `KS_WORKFLOWS_TOKEN`; only the code pin moves (owner's decision). `KS_APPS_DISPATCH_TOKEN` is set.
* **Update**: [Cross-repository relationships](cross-repo.md), [Rule architecture](rule-architecture.md): from ks-utility v0.16.0 the shared-workflow refs move with the pin; the optional `KS_WORKFLOWS_TOKEN` lets the bump rewrite them.
* **Update**: [Rule architecture](rule-architecture.md): per-platform optimization and icons beyond the known default files stay process rules.
* **Update**: `CLAUDE.md`, [Rule architecture](rule-architecture.md), [Cross-repository relationships](cross-repo.md), [Shared conventions](conventions.md): the rules `ks-suite-check` enforces from ks-utility v0.15.0 (platform folders, tag versions, no tracking SDKs, default icons, language files, ks-utility's updater, the newest pin) now point to it; every app uses ks-utility's updater.
* **New**: [Rule architecture](rule-architecture.md): rules code can carry live in ks-utility (with `ks-suite-check`), process rules in KS-Suite, one home per rule (owner's decision).
* **Update**: [Cross-repository relationships](cross-repo.md), [Release cycle](release-cycle.md) and `CLAUDE.md`: apps move to a new ks-utility tag the same day it is released, through ks-utility's bump workflow; the release workflow refuses a pin that is not the newest tag (replaces "before each release").
* **Update**: [Shared conventions](conventions.md) "App icons": legacy Android icons only below `minSdk` 26; check the built APK.
* **Update**: [Shared conventions](conventions.md) and `CLAUDE.md`: owner's rule: no default framework icon in any build on any platform; each platform's icon places listed. The language row names `ks-forge` as the second Tauri app.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-tv-launcher` on ks-utility v0.14.0 and step 5, released as `google-tv-v0.11.1`.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): every app's status refreshed (built steps, latest releases, ks-utility versions).

# 2026-11-26

* **Update**: every link and the landing page: the repository is now `kumasumit/ks-suite` (lower case, like the app repositories), and the landing page is `https://kumasumit.github.io/ks-suite/`.
* **Update**: [Release cycle](release-cycle.md), [Cross-repository relationships](cross-repo.md) and `CLAUDE.md`: owner's rule: every app moves to the newest ks-utility tag before each release.
* **Update**: [Landing page](landing-page.md): releases are ordered by version, not GitHub's list order, and a card names only the versions of the downloads it shows.
* **Update**: [Release cycle](release-cycle.md) and `CLAUDE.md`: owner's rule for every repository: build, test, release without waiting; no approval before a tag; hand checks never block a release.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): every app's status refreshed from its own plan and releases.
* **Update**: [Versioning and signing](versioning-signing.md) and `CLAUDE.md`: a Chrome extension tags `chrome-vX.Y.Z` (ks-utility `v0.11.0`).
* **Update**: every spec and the landing page: `ks-beam` and `ks-forge` moved to the GitHub account `kumasumit` too; no suite link names `kumarsumit17` any more.
* **Update**: [Testing](testing.md): the `ks-streamflix` row has the separate TV app's install command, the headless server and the .dmg build.
* **Update**: [Platform folders](platform-folders.md), [Testing](testing.md): `ks-streamflix` ships a separate Google TV app from v1.1.0.
* **Update**: every spec, `README.md`, the landing page and its collector: the repositories moved from the GitHub account `kumarsumit17` to `kumasumit` (the landing page is now `https://kumasumit.github.io/KS-Suite/`); `ks-beam` and `ks-forge` keep their old links until they move.

# 2026-11-25

* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-beam` releases with platform tags.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-vault` tags `android-vX.Y.Z`.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-streamflix` bridge release is v1.2.0, after the plain v1.1.0.
* **Update**: [Landing page](landing-page.md): each platform's download comes from the newest release that has its file (platform tags), and the card links to all releases.
* **Update**: [Versioning and signing](versioning-signing.md), [Release cycle](release-cycle.md), [Per-platform optimization rollout](plan-per-platform.md) and `CLAUDE.md`: owner's rule, replacing the one-version rule: platform tags (`android-`, `google-tv-`, `mac-`, `windows-vX.Y.Z`) for every app, one-platform apps included; a plain tag still releases every platform; a bridge release first for apps that check for updates.
* **Update**: workspace `CLAUDE.md`: eight apps; `ks-forge` is the second desktop-only Rust/Tauri app, so the Kotlin, Gradle and package-root rules do not apply to it, and it takes `ks-utility` as git dependencies like `ks-download-manager`.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-forge` plan approved, one version, building.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-beam` steps 2 and 3 on dev; `ks-jaiplayer` back to one version.
* **Update**: [Testing](testing.md): `scripts/emulators.sh` checks the AVD on a port before `serial`, `start` or `stop`, and refuses when another AVD holds it.
* **Update**: [Versioning and signing](versioning-signing.md), [Release cycle](release-cycle.md), [Per-platform optimization rollout](plan-per-platform.md) and `CLAUDE.md`: owner's rule for every app: one `vX.Y.Z` tag releases all platform builds with one version; platform tags and bridge releases are not used for now; the per-platform plans cover only the optimizations.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-forge` plan drafted, waiting for approval.
* **Update**: [Per-platform optimization rollout](plan-per-platform.md): `ks-expense-manager` done (v0.1.0); `ks-vault` step 1 on dev; `ks-streamflix` plan waiting for approval.
* **New**: [Per-platform optimization rollout](plan-per-platform.md): the order the apps follow, how each audits and plans, the gaps to check, and each app's status (handed over from the per-platform session).
* **Update**: [Versioning and signing](versioning-signing.md): before its first platform tag, an app that updates itself ships one plain bridge release that reads the release list.
* **Update**: [Testing](testing.md): the `ks-vault` row has its Gradle build (`:mobile:android`), the no-network check and `FLAG_SECURE` screen reading; always set `ANDROID_SERIAL`; `ks-forge` rows for macOS and Windows (CI).
* **Update**: [Platform folders](platform-folders.md), [index](index.md): `ks-forge` (desktop terminal, macOS and Windows) added; the landing page lists KS Forge.
* **Update**: [Versioning and signing](versioning-signing.md), [Release cycle](release-cycle.md): platform tags (`android-`, `google-tv-`, `mac-`, `windows-vX.Y.Z`) give each platform its own version (ks-utility v0.10.0); ks-jaiplayer first.
* **Update**: [Platform folders](platform-folders.md): every app optimizes each platform build for its own OS, with as few dependencies as possible, and keeps a per-platform plan in its `specs/` (owner's rule).
* **Update**: [Platform folders](platform-folders.md): `ks-beam` ships a separate Google TV app from v1.1.0 (the phone app sends, the TV app receives).

# 2026-11-24

* **Update**: [Platform folders](platform-folders.md): the one-APK bridge release before a TV split is only for apps that update themselves; `ks-beam` has no in-app updater and skips it.
* **Update**: [Release cycle](release-cycle.md): step 1 now includes trying the release build on the emulators before every release (phone, the Google TV sizes for TV apps, the Mac, Windows through CI); the owner's hand checks on real devices stay step 5. [Testing on every platform](testing.md): the `ks-streamflix` row (phone and TV emulators, the server on macOS and Windows, `./gradlew check`).
* **Update**: [Release cycle](release-cycle.md): paid signing (Apple Developer ID and notarisation, Windows Authenticode) and hand checks never block a release; they are kept as to-dos, and free signing (Android keystore, provenance attestation) is always done.
* **Update**: [Platform folders](platform-folders.md) (new section "Phone and Google TV builds"), [Versioning and signing](versioning-signing.md) and [Testing on every platform](testing.md): an app with a `tv/google-tv` application module ships a separate TV APK and AAB (`…-google-tv`, TV `versionCode` + 1,000,000,000 for Google Play); phone-only apps ship no TV build, TV-only apps no phone build. `ks-jaiplayer` first (v1.2.0), then `ks-streamflix` and `ks-beam`.
* **Update**: [Landing page](landing-page.md): a download button appears only for an APK the release has: `…-google-tv.apk` is the Google TV build, any other APK the phone build (the TV build in a TV-only app); a phone APK no longer doubles as a Google TV button, and the platform list hides Android or Google TV when its APK is missing.
* **Update**: [Platform folders](platform-folders.md): `ks-streamflix` targets `desktop/mac` and `desktop/windows` (the media server with its window), `mobile/android` and `tv/google-tv` (one APK), with a `shared/` folder; only `mobile/ios` stays empty (released as v1.0.0).
* **Update**: [Landing page](landing-page.md) and [Cross-repository relationships](cross-repo.md): the page updates itself. Each app repository keeps its card in `ks-suite.json`; an hourly Pages run (`.github/scripts/collect-apps.mjs`) finds new apps and sets each status from its releases, and the page shows a first release straight away. Android and Google TV get separate download buttons on every card.
* **Update**: [Cross-repository relationships](cross-repo.md): `ks-streamflix` → `ks-jaiplayer`: JaiPlayer's `ACTION_VIEW` accepts `http`/`https` stream links (signed, no header, plain http allowed) from v1.0.4, with `EXTRA_TITLE` as the name.

# 2026-11-23

* **Update**: [Versioning and signing](versioning-signing.md): new section "A new repository: signing first": every new app repository gets its four signing secrets from the suite keystore (alias `ks-release`) set and checked before any code, CI or release work, with a password line that saves only what `keytool` accepts; never change secrets during a run.
* **Update**: [Platform folders](platform-folders.md) and [Testing on every platform](testing.md): `ks-beam` targets Google TV too (its one APK is a receiver on TVs), tested by casting from the Mac to the TV emulator; its Windows build is tested on CI.
* **Update**: new app `ks-beam` (casting to TVs and projectors over DLNA from Android, Windows and macOS; Google TV receiver planned): [Platform folders](platform-folders.md) targets, [Testing on every platform](testing.md) matrix, the Apps list in the index, `.gitignore` and `CLAUDE.md`.
* **Update**: [Testing on every platform](testing.md): TV screen sizes: one Google TV emulator per size (32, 43, 50, 55, 65, 75, 85 and 100 inch) from `scripts/emulators.sh create-sizes`; every Google TV app change is tested on all of them.
* **Update**: [Release cycle](release-cycle.md): new Branches section: every repository has only `dev` and `main`; all work is committed on `dev`, `main` only fast-forwards to `dev`, new work starts from `dev` brought up to date with `main`, and any other branch is deleted once its work is on `dev`.
* **Creation**: [Testing on every platform](testing.md) added: app × platform matrix; shared phone and Android TV emulators (`ks-phone-36`, `ks-tv-36`, API 36) through `scripts/emulators.sh`; Windows tested on CI (`windows-2025`) with the unsigned installer kept as an artifact, plus an optional Windows 11 ARM VM; the Chrome extension loaded unpacked by hand.
* **Update**: [Landing page](landing-page.md): ks-download-manager marked released (v0.1.2), with macOS and the Chrome extension released and Windows in beta; new optional `platformStatus` field in `apps.json`.

# 2026-11-22

* **Update**: [Landing page](landing-page.md): released as `v1.0.0` (GitHub release "Landing page v1.0.0" on `504ab8f`); the repository's Website field now points to the page.
* **Update**: [Landing page](landing-page.md): "Show apps" is a pill-shaped on/off switch with a round knob instead of a Show/Hide button.
* **Update**: [Landing page](landing-page.md): bright palette instead of zinc: violet-to-pink gradient buttons and title, a colour per app for the icon box, coloured group headings and badges, soft glows behind the intro, deep-indigo dark mode. All text pairs pass WCAG AA.
* **Added**: [Release cycle](release-cycle.md): one cycle for every app (dev with CI and a rehearsal green, fast-forward main, push the tag, the workflow publishes a full release marked latest; hand checks after the release go into the next version).
* **Update**: [Versioning and signing](versioning-signing.md): links to the release cycle; ks-download-manager's release workflow exists.
* **Update**: [Landing page](landing-page.md): the apps button is a Show apps / Hide apps toggle.
* **Update**: [Landing page](landing-page.md): `app.js` requests its data files with the deploy's version too, so a page cached from an earlier deploy never reads newer data.
* **Update**: [Landing page](landing-page.md): closer to the owner's shadcn-style design: "KS-Suite" title with a release-hub label, "Applications" heading, monochrome Lucide icons in bordered boxes (`icon` is now a Lucide name; the app SVGs are removed), one platform pill per card, and a footer row with the tech line and release on the left and download / "Latest release" (`/releases/latest`) buttons on the right. New optional `restricted` field.
* **Update**: [Landing page](landing-page.md): back to the plain zinc cards (owner's choice); the `accent`, `featured` and `highlights` fields are removed. Groups and the `#apps` view stay.
* **Update**: [Landing page](landing-page.md): CSS and JavaScript links carry `?v=__VERSION__`, stamped with the commit id by the Pages workflow, after a cached old `app.js` left the apps empty for a visitor.
* **Update**: [Landing page](landing-page.md): the Pages workflow is split into `build` and `deploy` jobs, after single-job deploys failed to find the just-uploaded artifact.
* **Update**: [Landing page](landing-page.md): apps grouped into sections (`groups` in `apps.json`); cards take an optional `accent` colour, `featured` flag and `highlights`; the apps and install notes show only at `#apps`, opened by a new "See the apps" button.
* **Update**: [Landing page](landing-page.md): flat monochrome zinc look; intro with a small circular profile picture beside the title, a lead line and a repository button; cards show the repository id and an optional `stack` line from `apps.json`; new Quick install notes section; footer credits GitHub Actions and Lucide.
* **Update**: [Landing page](landing-page.md): the hero is centred, with the owner's GitHub profile picture as a circular image above the title (served from `site/icons/avatar.jpg`, not from GitHub).
* **Update**: [Landing page](landing-page.md): the language choice is a dropdown (Same as system, English, हिंदी) instead of a button group.
* **Update**: [Landing page](landing-page.md): new look (hero with glows, feature tiles, lifting cards, sticky header) and a System/Light/Dark theme switch that is remembered; colours now use `light-dark()`.
* **Update**: [Landing page](landing-page.md) built in `site/` with the Pages workflow; now a Specification. The language switch has a System option (the language rule), and the Windows file rule skips bundled tools such as `ffmpeg.exe`. README points to the page.
* **Creation**: [Landing page](landing-page.md) plan added (draft, waiting for owner approval).

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
