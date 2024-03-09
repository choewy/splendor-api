#!/bin/bash

if [ -e ".env" ]; then
  cp .env.public .env
fi

exit 0;