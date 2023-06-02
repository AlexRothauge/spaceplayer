#!/usr/bin/bash
# This script will make sure mysql is up and running when we need it
# will fail if mysql database is not up
wget -O - -T 2 "http://db:3306"

while [ $? -ne 0 ]; do
    sleep 5
    wget -O - -T 2 "http://db:3306"
done