---
type: Reference
title: Cross-repository relationships
description: How the KS-Suite apps link to each other through user-started Android intents, and the contract on each edge.
tags: [cross-repo, intents, contracts]
---

# Cross-repository relationships

The apps share **no runtime services** and never depend on each other. Each one builds, ships, and works alone. The only shared code is generic utilities in [`ks-utility`](https://github.com/kumarsumit17/ks-utility), which every app takes as a dependency pinned to a commit.
Every link between them is an explicit Android intent that the user starts. Each link is listed below so that a change to one side can be checked against the other.

```mermaid
graph LR
    subgraph TV["📺 Android TV / Google TV"]
        L[ks-tv-launcher]
        S[ks-streamflix]
    end
    subgraph MP["🖥 Multi-platform"]
        J[ks-jaiplayer]
    end
    subgraph PH["📱 Android (offline)"]
        E[ks-expense-manager]
        V[ks-vault]
    end

    L -- "launches (package intent)" --> S
    L -- "launches (package intent)" --> J
    S -- "ACTION_VIEW video/* (optional handoff)" --> J
    L -. "subscriptions export (share intent, user-started)" .-> E
    V:::isolated

    classDef isolated stroke-dasharray: 4 4
```

## Edge contracts

| From → To | Mechanism | Contract | Fallback if target missing |
|---|---|---|---|
| `ks-tv-launcher` → `ks-streamflix`, `ks-jaiplayer` | `PackageManager.getLeanbackLaunchIntentForPackage` | Target package IDs `com.ks.streamflix`, `com.ks.jaiplayer` | Tile hidden |
| `ks-streamflix` → `ks-jaiplayer` | `ACTION_VIEW`, MIME `video/*`, explicit package, `EXTRA_TITLE` | JaiPlayer must keep its `ACTION_VIEW` intent filter, which accepts `http`/`https` stream links (JaiPlayer v1.0.4+): StreamFlix sends signed links that need no header, and plain http is allowed for the home server. StreamFlix shows the button only when the intent resolves | Built-in ExoPlayer |
| `ks-tv-launcher` ⇢ `ks-expense-manager` | `ACTION_SEND`, `text/csv` | Columns `name,amount_minor,currency,cycle,next_due` | Standard share sheet |
| `ks-vault` | none | **Isolated by design**: no outbound links and no network | — |
| `ks-download-manager` | none | Standalone: no links to other apps | — |
| `ks-utility` → Kotlin apps | Git submodule at `ks-utility/`, `includeBuild("ks-utility/kotlin")`, dependency `com.ks:utility` | Generic utilities only, standard library only, plain Kotlin/JVM; the app pins a commit. The Gradle wiring is added when an app's Gradle build is created; `ks-tv-launcher` has not committed the submodule yet | — |
| `ks-utility` → `ks-download-manager` | Git dependencies in `package.json` and `src-tauri/Cargo.toml` | Root `package.json` exports `typescript/src/index.ts`; crate `ks-utility` in `rust/`; the app pins a commit | — |

> When an edge contract changes, update this table and the `CLAUDE.md` files on **both** sides in the same release cycle.

## The landing-page card
Every app repository keeps a `ks-suite.json` at its root: its card on the KS-Suite landing page (name, group, icon, platforms, stack, English and Hindi tagline). The Pages workflow here reads it from the default branch every hour; adding the file to a new repository is all it takes to list the app. Format and rules: [Landing page](landing-page.md#the-app-card-ks-suitejson). When an app changes its platforms or description, it updates its own card.

## Shared code

`ks-utility` is a build-time dependency only: it adds no runtime link between apps. An app gets a change to it only when the app moves its pinned version tag (a pushed tag never moves), so `ks-utility` never changes the meaning or signature of a function that is in use. The mechanism is described in [ks-utility's usage spec](https://github.com/kumarsumit17/ks-utility/blob/main/specs/usage.md).
