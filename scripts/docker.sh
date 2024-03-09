#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm ci
fi

if [ ! -d ".env" ]; then
  cp .env.public .env
fi

npm run build

tar -czvf docker/build.tar.gz .env dist package*

cd docker

docker-compose up --build -d mysql
docker-compose up --build admin client stream

exit 0