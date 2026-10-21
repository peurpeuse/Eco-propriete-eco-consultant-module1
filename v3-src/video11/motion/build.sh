#!/bin/sh
cd "$(dirname "$0")" && python3 timing.py && node_modules/.bin/esbuild src/entry.jsx --bundle --minify --outfile=public/bundle.js --loader:.js=jsx --jsx=automatic --log-level=warning
