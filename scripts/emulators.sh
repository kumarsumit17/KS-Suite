#!/bin/sh
# Android phone and Google TV emulators for testing the KS-Suite apps on this Mac.
# See specs/testing.md. Development tool only; nothing here is shipped.
#
#   scripts/emulators.sh create          # create the two AVDs (once)
#   scripts/emulators.sh start phone|tv  # boot one (add --headless for no window) and wait
#   scripts/emulators.sh stop  phone|tv  # shut it down
#   scripts/emulators.sh list            # AVDs and running devices
#   scripts/emulators.sh serial phone|tv # adb serial of the running one (for adb -s / ANDROID_SERIAL)
#
# Needs: the SDK packages emulator, platform-tools,
#   system-images;android-36;google_apis;arm64-v8a and system-images;android-36;android-tv;arm64-v8a
set -eu

SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/opt/homebrew/share/android-commandlinetools}}"
AVDMANAGER="$SDK/cmdline-tools/latest/bin/avdmanager"
EMULATOR="$SDK/emulator/emulator"
ADB="$SDK/platform-tools/adb"
export ANDROID_HOME="$SDK" ANDROID_SDK_ROOT="$SDK"

PHONE_AVD=ks-phone-36
TV_AVD=ks-tv-36
PHONE_PORT=5554   # adb serial emulator-5554
TV_PORT=5556      # adb serial emulator-5556

avd_of() { case "$1" in phone) echo "$PHONE_AVD" ;; tv) echo "$TV_AVD" ;; *) echo "phone or tv, not '$1'" >&2; exit 2 ;; esac; }
port_of() { case "$1" in phone) echo "$PHONE_PORT" ;; tv) echo "$TV_PORT" ;; esac; }

has_avd() { "$EMULATOR" -list-avds 2>/dev/null | grep -qx "$1"; }

create_one() { # name image device
  if has_avd "$1"; then echo "$1: exists"; return; fi
  [ -f "$SDK/$(echo "$2" | tr ";" "/")/package.xml" ] || { echo "missing SDK package: $2 (sdkmanager \"$2\")" >&2; return 1; }
  echo no | "$AVDMANAGER" create avd -n "$1" -k "$2" -d "$3" >/dev/null
  # Hardware keyboard on, so the Mac's arrow keys, Enter and Esc act as the D-pad, OK and Back.
  printf 'hw.keyboard=yes\nhw.dPad=yes\n' >> "$HOME/.android/avd/$1.avd/config.ini"
  echo "$1: created"
}

case "${1:-}" in
  create)
    rc=0
    create_one "$PHONE_AVD" "system-images;android-36;google_apis;arm64-v8a" pixel_8 || rc=1
    create_one "$TV_AVD" "system-images;android-36;android-tv;arm64-v8a" tv_1080p || rc=1
    exit "$rc"
    ;;
  start)
    which="${2:?phone or tv}"; avd=$(avd_of "$which"); port=$(port_of "$which"); serial="emulator-$port"
    extra=""; [ "${3:-}" = "--headless" ] && extra="-no-window -no-audio"
    if ! "$ADB" devices | grep -q "^$serial"; then
      # shellcheck disable=SC2086
      nohup "$EMULATOR" -avd "$avd" -port "$port" -no-snapshot-save -no-boot-anim $extra >"${TMPDIR:-/tmp}/$avd.log" 2>&1 &
    fi
    "$ADB" -s "$serial" wait-for-device
    i=0
    until [ "$("$ADB" -s "$serial" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = 1 ]; do
      i=$((i + 1)); [ "$i" -gt 180 ] && { echo "$avd did not boot in 6 minutes (log: ${TMPDIR:-/tmp}/$avd.log)" >&2; exit 1; }
      sleep 2
    done
    "$ADB" -s "$serial" shell input keyevent 82 >/dev/null 2>&1 || true   # dismiss the lock screen
    echo "$avd booted as $serial"
    ;;
  stop)
    serial="emulator-$(port_of "${2:?phone or tv}")"; "$ADB" -s "$serial" emu kill >/dev/null 2>&1 || true; echo "stopped $serial"
    ;;
  serial)
    echo "emulator-$(port_of "${2:?phone or tv}")"
    ;;
  list)
    "$EMULATOR" -list-avds; "$ADB" devices
    ;;
  *)
    sed -n '2,12p' "$0"; exit 2
    ;;
esac
