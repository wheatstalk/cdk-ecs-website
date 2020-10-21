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

function destroy() {
  log "Destroying $INTEG"
  cdk --output "$ASSEMBLY" --app "yarn ts-node --project tsconfig.jest.json $INTEG_FILE" destroy

  cleanup
}

function verify() {
  synth

  log "Comparing output with expected output"
  diff -u $ASSEMBLY/*.template.json "$EXPECTED" || die "The template changed please deploy to manually verify and then approve if it works."

  log "$INTEG_FILE is exactly as expected"
  cleanup
}

set -eo pipefail

HERE=$(realpath "$(dirname "$0")")
INTEG=$1
COMMAND=$2
ASSEMBLY="$HERE/cdk.out.integ.$INTEG"
EXPECTED="$HERE/test/integ.$INTEG.expected.json"
INTEG_FILE="test/integ.$INTEG.ts"

# When 'all' is requested, run the command for all integration tests.
if [ "$INTEG" = "all" ]; then
  for INTEG in $(find test -name "integ.*.ts" | sed -r 's#.*/integ\.(.*)\.ts#\1#'); do
    log "=> $INTEG $COMMAND"
    $0 "$INTEG" "$COMMAND"
  done
  exit
fi

# Run a command for a single integration test.
case "$COMMAND" in
  synth) synth;;
  deploy) deploy;;
  approve) approve;;
  destroy) destroy;;
  verify) verify;;
  *) die "Unknown command $COMMAND"
esac
