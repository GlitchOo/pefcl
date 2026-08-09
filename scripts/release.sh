#!/bin/sh
set -eu

PREFIX="[PEFCL]"
RESOURCE="pefcl"

echo "$PREFIX Creating release"
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

echo "$PREFIX Zipping it up: $RESOURCE.zip"
cd temp && zip -r "$RESOURCE.zip" "./$RESOURCE"
