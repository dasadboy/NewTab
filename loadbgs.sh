#!/bin/bash

echo "let backgrounds = [" > bgs.js
for b in backgrounds/*
do 
  echo "  '${b##*/}',">> bgs.js
done
echo "]" >> bgs.js