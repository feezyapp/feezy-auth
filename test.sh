#!/usr/bin/env bash
docker build . -t sentiment-analysis-test:latest -f dev.Dockerfile

docker run                  \
    --rm                    \
    --name=sentiment-analysis-test  \
    --env "PORT=8099" \
    --env "MONGO_DB_URL=mongourl" \
    -v "${PWD}":/user \
    -w "/user"  \
    sentiment-analysis-test:latest  \
    npm run test
