#!/bin/bash

cd docker

docker-compose up --build -d mysql redis zookeeper kafka

cd ..

if [ ! -d "node_modules" ]; then
  npm ci
fi

npm run env
npm run build

tar -czvf docker/build.tar.gz .envs dist package*

cd docker

docker-compose up --build -d admin
docker-compose up --build -d client stream

exit 0