#!/bin/bash

set -e
set -u

startup() {
  printf " \n"
  # Run database migrations
  echo "<<<<<<<<<<<<<<<<<<<< Waiting for postgres... >>>>>>>>>>>>>>>>>>>>>>>>"
  while ! nc -z db 5432; do

    sleep 2

  done
  echo "<<<<<<<<<<<<<<<<<<<< PostgreSQL started >>>>>>>>>>>>>>>>>>>>>>>>"

  # start server
  yarn start:dev &

  /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --service-cluster account_service
}

startup
