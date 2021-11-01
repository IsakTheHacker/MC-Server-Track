#!/bin/sh

npm ci		#Reinstall packages

npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH

node .		#Start bot