#!/bin/bash

function log() {
  echo "$*" >&2
}

function die() {
  log "$*"
  exit 1
}

function cleanup() {
  rm -rf "$ASSEMBLY"
}

function synth() {
  log "Synthesizing $INTEG_FILE"
  cdk --output "$ASSEMBLY" --app "yarn ts-node --project tsconfig.jest.json $INTEG_FILE" synth >/dev/null
}

function deploy() {
  synth

  log "Deploying $INTEG"
  cdk --app "$ASSEMBLY" deploy

  log "Verify per the instructions in $INTEG_FILE and then use the approve command."
}

function approve() {
  log "Approved $INTEG"
  cp $ASSEMBLY/*.template.json "$EXPECTED"

  cleanup
}

function verify() {
  synth

  log "Comparing output with expected output"
  diff -u $ASSEMBLY/*.template.json "$EXPECTED" || die "The template changed please deploy to manually verify and then approve if it works."

  log "$INTEG_FILE is exactly as expected"
  cleanup
}

HERE=$(realpath "$(dirname "$0")")
INTEG=$1
COMMAND=$2
ASSEMBLY="$HERE/cdk.out.integ.$INTEG"
EXPECTED="$HERE/test/integ.$INTEG.expected.json"
INTEG_FILE="test/integ.$INTEG.ts"

case "$COMMAND" in
  synth) synth;;
  deploy) deploy;;
  approve) approve;;
  verify) verify;;
  *) die "Unknown command $COMMAND"
esac
