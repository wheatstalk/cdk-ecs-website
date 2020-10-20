#!/bin/bash

set -eo pipefail

function main() {
  if [ "$1" = "bash" ]; then
    exec "$@"
    # Not reached. Exec takes over the process.
  fi

  linkWpUploadsToDataVolume

  if isProduction; then
    configureProduction
  fi

#  checkDatabaseConfiguration

  exec "$@"
}

function log() {
  echo "$*" >&2
}

function die() {
  log "$*"
  exit 1
}

function isProduction() {
  [ "$WP_ENVIRONMENT" = "production" ];
}

function configureProduction() {
  log "Configuring for production"

  log "=> Removing debugmode.ini which contains both xdebug enable and opcache disable"
  # Disables xdebug and re-enables opcaching (same file)
  rm /usr/local/etc/php/conf.d/debugmode.ini
}

function linkWpUploadsToDataVolume() {
  DATA_UPLOADS_DIR=/data/uploads
  WP_UPLOADS_DIR=/var/www/html/wp-content/uploads

  log "=> Ensuring that the $DATA_UPLOADS_DIR exists"
  mkdir -p "$DATA_UPLOADS_DIR"

  log "=> Clearing out $WP_UPLOADS_DIR so that we can link it to $DATA_UPLOADS_DIR"
  rm -rf "$WP_UPLOADS_DIR"

  log "=> Ensuring that $DATA_UPLOADS_DIR permissions are correct"
  chmod a+w "$DATA_UPLOADS_DIR"

  log "=> Linking wordpress uploads ($WP_UPLOADS_DIR) => $DATA_UPLOADS_DIR"
  ln -sf "$DATA_UPLOADS_DIR" "$WP_UPLOADS_DIR"
}

function testDatabaseConnection() {
  log "Parsing host into dns hostname and port number"

  # Split strings like "db:3306" or "db" by ":" into an array named HOSTPORT (IFS is an internal variable used by 'read' to split a string)
  IFS=":" read -ra HOSTPORT <<<"$WORDPRESS_DB_HOST"
  DB_HOST=${HOSTPORT[0]}
  # If a port is specified, add a db port argument.
  DB_PORT_ARG=$([ -n "${HOSTPORT[1]}" ] && echo "--port=${HOSTPORT[1]}")

  for TRY_NUM in {1..10}; do
    log "Connection try #$TRY_NUM"
    # shellcheck disable=SC2086
    if echo "SHOW DATABASES;" | mysql --user="$WORDPRESS_DB_USER" --password="$WORDPRESS_DB_PASSWORD" --host="$DB_HOST" $DB_PORT_ARG; then
      log "Successful connection."
      return 0
    else
      log "Connection failed. See errors above."
      sleep 1
    fi
  done

  false
}

function checkDatabaseConfiguration() {
  log "Checking for database configuration"

  [ -z "$WORDPRESS_DB_HOST" ] && die "=> Missing database WORDPRESS_DB_HOST (database host and port)"
  [ -z "$WORDPRESS_DB_NAME" ] && die "=> Missing database WORDPRESS_DB_NAME (database name)"
  [ -z "$WORDPRESS_DB_USER" ] && die "=> Missing database WORDPRESS_DB_USER"
  [ -z "$WORDPRESS_DB_PASSWORD" ] && die "=> Missing database WORDPRESS_DB_PASSWORD"

  log "=> Testing the database connection"
  if testDatabaseConnection; then
    log "==> Database connected."
  else
    log "==> Database connection failed. See errors above. Continuing anyway."
  fi

  true
}

#
# Script begins
#

main "$@"
