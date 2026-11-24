---
type: Playbook
title: Testing on every platform
description: How each KS-Suite app is built, run and tested on each platform it targets from the owner's Apple-silicon Mac, with emulators for Android and Google TV, CI for Windows, and Chrome for the extension.
tags: [testing, emulator, ci, windows, chrome-extension, playbook]
---

# Testing on every platform

The owner's machine is an Apple-silicon Mac. Android phones and Google TV are tested on emulators on the Mac, macOS natively, Windows on GitHub Actions (plus an optional Windows virtual machine), and the Chrome extension in Chrome on the Mac. Which app targets which platform is in [Platform folders](platform-folders.md); releases follow the [Release cycle](release-cycle.md).

## Matrix

| App | Platform | Build and test | Run it | Where |
|---|---|---|---|---|
| `ks-tv-launcher` | Google TV | `./gradlew assembleDebug testDebugUnitTest lintDebug`, `connectedDebugAndroidTest` on the TV emulator | `installDebug`, then `adb shell am start -n com.ks.tvlauncher.dev/com.ks.tvlauncher.MainActivity` (KS TV Dev only) | Mac (TV emulator) |
| `ks-streamflix` | Google TV | `./gradlew assembleDebug testDebugUnitTest lintDebug`, `connectedDebugAndroidTest` | `installDebug`, then `adb shell monkey -p com.ks.streamflix -c android.intent.category.LEANBACK_LAUNCHER 1` | Mac (TV emulator); no Gradle build yet |
| `ks-vault` | Android phone | `./gradlew assembleDebug testDebugUnitTest lintDebug`, `connectedDebugAndroidTest` (Keystore needs a device) | `installDebug`, then `adb shell monkey -p com.ks.vault 1` | Mac (phone emulator); no Gradle build yet |
| `ks-expense-manager` | Android phone | `./gradlew assembleDebug testDebugUnitTest lintDebug`, `connectedDebugAndroidTest` (Room migrations) | `installDebug`, then `adb shell monkey -p com.ks.expense 1` | Mac (phone emulator); no Gradle build yet |
| `ks-jaiplayer` | Android phone and Google TV (separate apps from v1.2.0) | `./gradlew :shared:allTests`, the Android module's unit tests and lint | `:mobile:android:installDebug` on the phone emulator and `:tv:google-tv:installDebug` on the TV emulator; `ACTION_VIEW` hand-off with `adb shell am start -a android.intent.action.VIEW -d <file or URL> -t video/*` | Mac (both emulators) |
| `ks-jaiplayer` | macOS | `./gradlew :shared:allTests`, `:desktop:mac:run`, `:desktop:mac:packageReleaseDistributionForCurrentOS` (.dmg) | needs VLC 3.x installed | Mac |
| `ks-jaiplayer` | Windows | `:shared:desktopTest`, `:desktop:windows:packageReleaseMsi`, silent install and uninstall | the CI run's unsigned .msi, on a Windows machine or VM | **CI only** (`windows-2025`) |
| `ks-download-manager` | macOS | `npm run build`, `test:lang`, `test:ui`, `cargo test`, `cargo clippy` | `npm run tauri dev`; `npm run tauri build` for the .dmg | Mac |
| `ks-download-manager` | Windows | the same checks on Windows; the NSIS installer is built, installed silently, checked and uninstalled | the CI run's `windows-installer-unsigned` artifact | **CI only** (`windows-2025`) |
| `ks-download-manager` | Chrome extension | `npm run test:extension`, `build:extension`, `test:lang`; `scripts/extension-id.mjs` checks the fixed ID | load `extension/dist` unpacked (below) | Mac (Chrome); also built on CI |
| `ks-beam` | Android phone | `./gradlew :shared:desktopTest check`, `:mobile:android:assembleDebug` | `installDebug` on the phone emulator, `adb shell monkey -p com.ks.beam 1`; the emulator's private network never sees TVs, so casting is tested on a real phone | Mac (phone emulator) and a real phone |
| `ks-beam` | Google TV (receiver) | `./gradlew check`, `:mobile:android:assembleDebug` | `installDebug` on the TV emulator, then cast from the Mac: `adb forward tcp:49152 tcp:<port from logcat>` and `EmulatorCastTest` with `KS_BEAM_RENDERER=http://127.0.0.1:49152/desc.xml` (ks-beam `CLAUDE.md`) | Mac (TV emulator) |
| `ks-beam` | macOS | `./gradlew check`; `:desktop:mac:packageReleaseDmg` needs a non-Homebrew JDK | `./gradlew :desktop:mac:run`; casting needs a DLNA TV or projector on the same network | Mac |
| `ks-beam` | Windows | `:shared:desktopTest`, `:desktop:windows:packageReleaseMsi`, silent install and uninstall | the CI run's `windows-msi-unsigned` artifact | **CI only** (`windows-2025`) |

An app with "no Gradle build yet" has its commands in its `CLAUDE.md`; they apply once its build exists.

## Android and Google TV emulators

`scripts/emulators.sh` in this repository creates and starts two Android Virtual Devices, shared by every app:

| AVD | System image | Device | adb serial |
|---|---|---|---|
| `ks-phone-36` | `system-images;android-36;google_apis;arm64-v8a` (Android 16) | `pixel_8` | `emulator-5554` |
| `ks-tv-36` | `system-images;android-36;android-tv;arm64-v8a` (Android TV 16) | `tv_1080p` | `emulator-5556` |

```bash
scripts/emulators.sh create              # once
scripts/emulators.sh start tv            # or phone; add --headless for no window
export ANDROID_SERIAL=$(scripts/emulators.sh serial tv)
cd <app> && ./gradlew installDebug connectedDebugAndroidTest
scripts/emulators.sh stop tv
```

- SDK: `/opt/homebrew/share/android-commandlinetools` (Homebrew `android-commandlinetools`), with `emulator`, `platform-tools` and the two system images. The script uses `ANDROID_HOME` if set.
- Both AVDs have a hardware keyboard: the Mac's arrow keys, Enter and Esc are the D-pad, OK and Back, so TV screens can be checked for D-pad navigation by hand. `adb shell input keyevent DPAD_DOWN` (or `DPAD_CENTER`, `BACK`) does the same from a script.
- Both can run at once; their fixed ports keep the serials stable.
- The AVDs are API 36. An app spec that names another API level (for example API 34 for TV) can add an AVD from `system-images;android-34;android-tv;arm64-v8a`.
- An emulator does not replace the hand check on a real TV or phone after a release ([Release cycle](release-cycle.md), step 5): remote, HDMI, performance and real-account behaviour differ.

### TV screen sizes

Every Google TV app change (`ks-tv-launcher`, `ks-streamflix`, `ks-jaiplayer` on TV) is tested on one emulator per common TV size, not only on `ks-tv-36`. The owner's TV is 55 inch.

| Size | AVD | Resolution | Density | adb serial |
|---|---|---|---|---|
| 32 inch | `ks-tv-32in` | 1280 x 720 | 213 (tvdpi) | `emulator-5560` |
| 43 inch | `ks-tv-43in` | 1920 x 1080 | 320 (xhdpi) | `emulator-5562` |
| 50 inch | `ks-tv-50in` | 3840 x 2160 | 640 (xxxhdpi) | `emulator-5564` |
| 55 inch | `ks-tv-55in` | 3840 x 2160 | 640 | `emulator-5566` |
| 65 inch | `ks-tv-65in` | 3840 x 2160 | 640 | `emulator-5568` |
| 75 inch | `ks-tv-75in` | 3840 x 2160 | 640 | `emulator-5570` |
| 85 inch | `ks-tv-85in` | 3840 x 2160 | 640 | `emulator-5572` |
| 100 inch | `ks-tv-100in` | 3840 x 2160 | 640 | `emulator-5574` |

```bash
scripts/emulators.sh create-sizes        # once: device definitions ks_tv_<inch> in ~/.android/devices.xml, and the AVDs
scripts/emulators.sh sizes               # tv-32 tv-43 ... tv-100
scripts/emulators.sh start tv-55 --headless
export ANDROID_SERIAL=$(scripts/emulators.sh serial tv-55)
```

- Each size is its own device definition with its true diagonal, and the resolution TVs of that size usually have. The density is the one Android TV uses for the resolution (720p 213, 1080p 320, 4K 640), never one computed from the inches, as on a real TV. So every size lays out the same 960 x 540 dp, and what differs between them is resolution and density (text and image sharpness, bitmap sizes, 4K memory use), not the layout.
- The emulator reports `xdpi`/`ydpi` equal to the density, not the panel's physical pixels per inch, so code that reads physical size gets the same values on every size. Physical size (how big text looks from the sofa) is checked by hand on a real TV.
- Run the sizes one at a time (each 4K TV emulator uses about 2 GB of memory). `connectedDebugAndroidTest` uninstalls the app when it finishes: install it again before checking screens by hand.
- More sizes are added to `TV_SIZES` in `scripts/emulators.sh` and to this table, then `create-sizes` again (existing AVDs are kept).

## Windows

An Apple-silicon Mac cannot build Windows installers (Compose's `jpackage` and Tauri's NSIS build each build only on their own OS) or run them. So:

- **CI is the Windows test.** Each desktop app's CI workflow runs on `windows-2025` on every push and pull request and on a manual run (Actions > CI > Run workflow). It runs the tests on Windows, builds the installer, installs and uninstalls it silently, and keeps the unsigned installer as a workflow artifact for 14 days.
  - `ks-download-manager`: `.github/workflows/ci.yml`, jobs `check-windows` and `installer-windows`, artifact `windows-installer-unsigned`.
  - `ks-jaiplayer`: a CI workflow of the same shape is added with its first desktop build (job `windows`, artifact `windows-msi-unsigned`).
- **Release rehearsals** (`workflow_dispatch` on `release.yml`) build the real release files without publishing ([Release cycle](release-cycle.md)).
- **Hands-on testing (optional):** a Windows 11 ARM virtual machine on the Mac, in UTM (free) or Parallels Desktop, with a Windows 11 licence the owner provides. Windows 11 ARM runs the x64 installers through its built-in x64 emulation, so the CI artifacts install as they are. Download the artifact with `gh run download <run-id> -n <artifact> -R kumarsumit17/<repo>` and copy it into the VM. The installers are unsigned test builds, so SmartScreen warns before they run. This is closer to a real PC than CI but is still not an x64 machine; the hand check on a real Windows PC after a release stays.

## Chrome extension

Only `ks-download-manager` has one (`extension/`, Manifest V3).

```bash
npm install
npm run test:extension        # unit tests
npm run build:extension       # extension/dist/
npm run test:lang             # includes extension/_locales
node scripts/extension-id.mjs extension/dist/manifest.json ikplfdbdfikcokpegkapjdedlgifmkbe
```

To test it by hand: open the desktop app once (it registers its native-messaging host with Chrome), then `chrome://extensions` > **Developer mode** > **Load unpacked** > `extension/dist`. After a rebuild, press the extension's reload button. CI keeps the same folder as the `extension-unpacked` artifact, and the release workflow zips it with checks on the zip.

Google Chrome 137 and later ignore the `--load-extension` switch, so a script cannot load the extension into the installed Chrome; automated loading would need Chrome for Testing or Chromium, which is not set up. Loading it is a hand step.

## What cannot be tested from the Mac

- Windows installers: built and installed only on CI (or in the optional VM).
- Real devices: a Google TV with a remote, an Android phone, an x64 Windows PC. These are the hand checks after each release.
- Code-signing prompts (SmartScreen with a signed installer, macOS Gatekeeper with the notarised build) appear only on release files.
