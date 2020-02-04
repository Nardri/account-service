#!/bin/sh

set -e
set -u

wait_for_db () {
  printf " \n"
  echo "<<<<<<<<<<<<<<<<<<<< Waiting for postgres... >>>>>>>>>>>>>>>>>>>>>>>>"
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 2
  done
  echo "<<<<<<<<<<<<<<<<<<<< PostgreSQL started >>>>>>>>>>>>>>>>>>>>>>>>"
}


startup () {

  # Run database migrations
  wait_for_db

  # start server
  npm run migration:run && npm run build && npm run start:prod &
  /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --service-cluster account_service
}

startup_II () {

 # Run database migrations
  wait_for_db

  # Run migrations and start server
  npm run migration:run && npm run start:dev &
  /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --service-cluster account_service
}

startup_II
