#!/usr/bin/env bash
# Publishes KS-Suite and its app repos to GitHub as public repositories.
# Safe to re-run: repos that already exist on GitHub are only pushed, never recreated.
# Requires the GitHub CLI:  brew install gh && gh auth login
set -euo pipefail

OWNER="kumasumit"
VISIBILITY="--public"
APPS=(ks-tv-launcher ks-jaiplayer ks-streamflix ks-vault ks-expense-manager ks-download-manager)

cd "$(dirname "$0")"
ROOT="$PWD"

command -v gh >/dev/null || { echo "GitHub CLI not found. Install: brew install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Not signed in. Run: gh auth login"; exit 1; }
LOGIN="$(gh api user -q .login)"
[ "$LOGIN" = "$OWNER" ] || { echo "gh is signed in as '$LOGIN', expected '$OWNER'."; exit 1; }

publish() {  # publish <dir> <repo-name> <description>
  local dir="$1" name="$2" desc="$3"
  echo; echo "=== $name ==="
  cd "$dir"
  [ -d .git ] || git init -b main

  # First commit only for repos that have no history yet; existing work is left untouched.
  if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    git add -A
    git commit -m "chore: initial commit" \
      -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01D2QEi7hV7k4VhFQ63y3mX3"
  fi

  if gh repo view "$OWNER/$name" >/dev/null 2>&1; then
    echo "Already on GitHub."
    git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$name.git"
  else
    gh repo create "$OWNER/$name" $VISIBILITY --description "$desc"
    git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$name.git"
  fi
  git push -u origin "$(git branch --show-current)"
  cd "$ROOT"
}

publish ks-tv-launcher     ks-tv-launcher     "KS-Suite: custom Android TV / Google TV home launcher"
publish ks-jaiplayer       ks-jaiplayer       "KS-Suite: multi-platform media player (Kotlin Multiplatform)"
publish ks-streamflix      ks-streamflix      "KS-Suite: D-pad optimized streaming media manager for Android TV"
publish ks-vault           ks-vault           "KS-Suite: fully offline secure vault and notekeeper for Android"
publish ks-expense-manager ks-expense-manager "KS-Suite: privacy-first personal expense tracker for Android"
publish ks-download-manager ks-download-manager "KS-Suite: free download manager for images, audio and video"
publish ks-utility         ks-utility         "KS-Suite: common generic utility functions shared across the suite apps"
publish .                  KS-Suite           "KS-Suite: a family of privacy-focused apps, with links to every app repo"

echo; echo "Done: https://github.com/$OWNER/KS-Suite"
