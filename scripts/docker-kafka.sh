#!/bin/bash

cd docker 

docker-compose up zookeeper kafka --build -d

exit 0