#!/bin/sh

docker-compose stop
mvn clean package -am &&
docker  build -t rill-flow-web:v0.0.1 -f docker/Dockerfile . &&
docker-compose up -d
