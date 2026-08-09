#!/bin/sh
set -eu

PREFIX="[PEFCL]"
RESOURCE="pefcl"
SHA="${GITHUB_SHA_SHORT:-$(git rev-parse --short HEAD)}"

echo "$PREFIX Creating pre-release"
rm -rf ./temp
mkdir -p "./temp/$RESOURCE/src/client"
mkdir -p "./temp/$RESOURCE/src/server"
mkdir -p "./temp/$RESOURCE/web"

cp LICENSE README.md config.json import.sql fxmanifest.lua "./temp/$RESOURCE"
cp -r ./src/dist "./temp/$RESOURCE/src/dist"
cp -r ./src/client/lua "./temp/$RESOURCE/src/client/lua"
cp -r ./src/server/lua "./temp/$RESOURCE/src/server/lua"
cp -r ./web/dist "./temp/$RESOURCE/web/dist"
cp -r ./web/media "./temp/$RESOURCE/web/dist/media"

echo "$PREFIX Zipping it up: $RESOURCE-pre-$SHA.zip"
cd temp && zip -r "$RESOURCE-pre-$SHA.zip" "./$RESOURCE"
