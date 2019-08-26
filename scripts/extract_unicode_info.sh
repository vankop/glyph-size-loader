#!/usr/bin/env bash
URL="https://www.unicode.org/Public/X/ucd/"
NAMES_LIST="NamesList.txt"
BLOCKS="Blocks.txt"

NAMES_LIST_URL="${URL//X/$1}$NAMES_LIST"
BLOCKS_URL="${URL//X/$1}$BLOCKS"

echo "Downloading $BLOCKS_URL.."
curl -s -o "../data/unicode-$1.blocks.txt" "$BLOCKS_URL"

echo "Downloading $NAMES_LIST_URL.."
curl -s -o "../data/unicode-$1.names-list.txt" "$NAMES_LIST_URL"

echo "Parsing.."
VERSION=$1 node ./apply.js
