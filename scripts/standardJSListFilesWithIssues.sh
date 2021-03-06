#!/bin/bash

prettier --write "app/*/*.js" "app/*.js"
errors=$(standard --fix app/*/*.js app/*.js)
totalErrors=$(($(echo "$errors"|wc -l)-1))
echo "$errors"|cut -d: -f1|sort|uniq
echo "$totalErrors errors"
