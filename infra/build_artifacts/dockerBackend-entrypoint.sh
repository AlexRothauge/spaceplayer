#!/bin/bash
bash ./scripts/check-mysql.sh
cd ./packages/backend || exit
npm run typeorm schema:sync
npm run start