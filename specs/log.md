# 2026-11-24

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
