#!/bin/sh
set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

mkdir -p tmp/pids

bundle exec puma -C ./config/puma.rb
