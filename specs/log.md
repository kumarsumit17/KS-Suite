# 2026-11-22

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
