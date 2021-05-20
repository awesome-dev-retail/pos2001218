#!/usr/bin/env bash

current=$(date "+%Y%m%d%H%M%S")
docker login posofline.azurecr.io
# username posofline
# password B/tMr986gtHnGDwLP=QcZgAfpFQfu8dl
docker build -t posfe:"$current" -f Dockerfiles/Offline/Dockerfile .
docker tag posfe:"$current" posofline.azurecr.io/posfe:"$current"
docker tag posfe:"$current" posofline.azurecr.io/posfe:latest
docker push posofline.azurecr.io/posfe:"$current"
docker push posofline.azurecr.io/posfe:latest
