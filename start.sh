#!/bin/bash
if [ ! -d "./userData" ]; then
  mkdir -p "./userData"
fi
if [ ! -d "./database" ]; then
  mkdir -p "./database"
fi
sudo docker build -t mts-server .
sudo docker run -it -p 3000:3000 -p 80:80 -v ./userData:/home/mts/server/userData -v ./database:/var/lib/mongodb mts-server
