---
type: Policy
title: Architecture, security and storage standards
description: How every KS-Suite app is built: minimal, local-first, zero-cost, with security and storage proportionate to its data, classified per app.
tags: [policy, architecture, security, storage, backup, privacy, performance]
---

# Architecture, security and storage standards

Owner's rule (2026-11-27), for every existing and future app. Where an older rule conflicts, this one wins, as long as security, data integrity and [release approval](release-cycle.md) still hold. Apply it [one app at a time](working-method.md); no app implements a capability it does not need.

## Principles

Minimal, lightweight, modular, performance-first, local-first, offline-first, privacy-first, user-owned data. KISS, YAGNI, DRY, separation of concerns where it pays. Every dependency, layer, background service and feature must justify itself; nothing is added for uniformity or for a hypothetical future. Working code is not rewritten only to match a pattern.

## Zero cost

No paid or billing-activated infrastructure: no cloud databases, hosting, auth, SMS or email OTP, cloud storage, analytics, monitoring, security SDKs, code-signing certificates, CI upgrades, subscriptions or trials that turn paid. Native platform features and maintained open-source libraries with compatible licences first ([Dependencies](dependencies.md)); GitHub Actions and Releases within free quotas. A requirement that cannot be met securely at zero cost is reported with a free alternative or deferred. Paid services only with the owner's explicit approval.

## Classification

| Class | When | Storage and security |
|---|---|---|
| **A, sensitive** | personal finance, IDs, documents, private notes | SQLite, encrypted at rest; optional PIN, password or pattern with native biometrics; auto-lock; key in native secure storage; encrypted backups by default; offline recovery; migrations; integrity checks |
| **B, persistent non-sensitive** | libraries, lists, history worth keeping | SQLite or another light store; migrations; import/export; local backups; integrity checks; app lock only if justified |
| **C, basic utility** | settings and small state | native preferences or simple files; minimal export/import of settings where useful; no SQLite, encryption or auth unless needed |

| App | Class | Why |
|---|---|---|
| `ks-vault` | A | notes, government IDs and tickets; already SQLCipher, pattern/password and encrypted `.ksvault` backups |
| `ks-expense-manager` | A | personal finance; Room/SQLite with JSON and CSV backups, not yet encrypted |
| `ks-streamflix` | B | the server's media library and watch progress (SQLDelight); losing it costs time, not privacy |
| `ks-tv-launcher` | B | subscriptions with renewal dates and the home layout (DataStore); worth backing up, not secret |
| `ks-jaiplayer` | C | settings and resume positions; nothing secret, little to lose |
| `ks-download-manager` | C | settings and download history in JSON |
| `ks-forge` | C | settings, profiles and themes in JSON; terminal output is never persisted beyond the user's session restore |
| `ks-beam` | C | almost no persistent data |

Each app's audit (its own `specs/`) confirms or corrects its row, and its classification is reviewed when its data changes.

## Storage and migrations

- SQLite for structured persistent data, native preferences or simple files otherwise. Versioned schemas, transactions, parameterized queries, needed indexes and foreign keys, WAL where suitable, integrity checks, platform-correct per-user folders ([DEV and PROD side by side](release-cycle.md#dev-and-prod-side-by-side)).
- Upgrades migrate automatically: a backup first, transactional, data preserved, tested from real previous production schemas with synthetic data; a newer unsupported schema is refused with a clear message, never silently downgraded. Users never export and re-import for an ordinary upgrade.
- No mandatory cloud database (Firebase, Supabase, MongoDB Atlas, AWS and the like).
- Nothing sensitive in logs, plain preferences or stray temp files.

## Encryption, keys and authentication (class A, or where justified)

- Encrypt at rest with SQLCipher Community or another mature free library; random keys, never a PIN used directly as a key, never hardcoded or plaintext. Keys in Android Keystore (phone, Google TV), macOS Keychain, Windows DPAPI. No home-made cryptography. A UI lock alone is not encryption.
- Migrating an existing plaintext database: recoverable backup, validated migration, integrity check, data confirmed, recovery tested, temporary plaintext files removed safely. Production data is never put at risk.
- App lock where it helps: optional 6-digit PIN, password or Android pattern, native biometrics (Android BiometricPrompt, Touch ID, Windows Hello) and device credential; change and disable after re-authenticating; auto-lock and lock in background; re-auth before sensitive actions; rate limits and growing delays. Google TV: remote-friendly numeric PIN, no pattern. PINs and passwords only as Argon2id, scrypt or strong PBKDF2 hashes.
- Offline only: no mandatory Google sign-in, email or SMS OTP, phone number, Firebase Auth or accounts. Recovery by device credential, an offline recovery key that truly restores access, or a password-protected backup. No master passwords, backdoors or bypasses. The app says plainly that losing every credential and backup loses the data. A reset needs explicit confirmation; data is never deleted silently.

## Backup, import and export (class A and B; class C where useful)

- **Backups:** manual, daily while the app runs (no service just for backups), and automatically before migrations, imports and destructive actions; retention 7 daily and 4 weekly by default, configurable; restore from any kept backup; consistent SQLite snapshots (backup API or `VACUUM INTO`, never a raw copy of a live database with its WAL). Local backups do not protect against losing the device; the app says so.
- **`.ksbackup`** where a portable full backup helps: a zip with `manifest.json` (app ID, app version, schema version, format version, created, encrypted or not, integrity, platform, DEV or PROD; never keys, tokens or credentials), the database or encrypted database, `settings.json`, `attachments/` and `checksums.sha256`. Restores across platforms of the same app where compatible. Existing formats (such as `.ksvault`) stay supported.
- **Encrypted backups** (default for class A): AES-256-GCM, a strong password KDF, random salt and nonce, authenticated, restorable on another device without the original device's secure storage, temporary decrypted files handled safely.
- **Import:** choose file → validate format, integrity, app identity and schema → preview, find duplicates and conflicts → merge or replace → explicit confirmation → backup current data → one transaction → validate → report. Never a partial import; imported files are untrusted (archive bombs, path traversal, oversized or invalid content); a failed import leaves data as it was. Exporting sensitive data unencrypted needs a clear warning.
- **User's own cloud:** export completed backups through the system file picker to local storage, external drives, Google Drive, OneDrive, iCloud Drive, Dropbox or a NAS. No cloud SDKs, accounts or KS-Suite-hosted storage; a live database is never synced through a cloud folder.

## Privacy and security

No telemetry, analytics, ads or third-party tracking ([`ks-suite-check`](rule-architecture.md)); no unnecessary personal data; least-privilege permissions; no hardcoded secrets; secure temp files; free dependency vulnerability checks (for example Dependabot alerts, `cargo audit`, `npm audit`); user-controlled export and deletion; a short privacy note per app; for class A, optional screenshot and recent-apps preview protection.

## Performance

Each app keeps a measured baseline per platform (download size, installed size, cold start, memory, and where measurable CPU, background activity, network, disk and battery) in its `specs/`. A DEV build is compared with it before approval is asked, and any meaningful growth is explained. No arbitrary targets before measuring, no claimed gains without measurements. Optimise for older phones and Google TV: native first, lazy loading, no unused dependencies or resources, minimal background work.

Optimizations (owner's rules, 2026-11-28; evidence: ks-jaiplayer's [Android and Pixel report](https://github.com/kumasumit/ks-jaiplayer/blob/dev/specs/plan-android-cpu.md) and [macOS report](https://github.com/kumasumit/ks-jaiplayer/blob/dev/specs/plan-macos-playback.md)), applied by each app when it becomes active:

- **Correctness first:** kept only if the output (picture, colour, sound, data) stays correct, checked by a test or a reference comparison.
- **Evidence:** measured before and after with the same file, device, build type and method, at least two rounds, in release-equivalent builds in the same compiled state; a change within the noise between rounds is not kept.
- **Whole system:** apps are compared on whole-device figures (the device's CPU, or the app plus the system processes doing its work), never the app process alone.

## Shared code in ks-utility

Reusable pieces (storage paths, settings, SQLite helpers, migrations, backup and `.ksbackup`, import validation, integrity checks, encryption, secure storage, PIN and biometric helpers, recovery keys, DEV/PROD environment) go into ks-utility only when an active app needs them and they are generic, as separate modules an app takes only if it uses them, with their own tests. No app bundles database, crypto or auth code it does not use. Across languages, share the format and behaviour spec, not one implementation.

## Future scale

Stable record IDs and versioned data contracts where cheap, so sync, accounts or optional premium services can come later. None of them is built without the owner's approval.

## Tests

Each app tests what it actually has: regressions, database and migrations from earlier production schemas, encryption, authentication and failures, recovery keys, backup and restore (including wrong passwords and damaged files), import/export round trips and duplicates, failed-import rollback, DEV/PROD isolation, upgrades without data loss, offline use. What cannot be automated is reported as pending the owner's manual check, never claimed.
