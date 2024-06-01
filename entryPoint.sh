#!/bin/bash

mongod --config /etc/mongod.conf &
a2enmod cgi fcgid
service apache2 restart

npm install -g npm@10.8.1
npm install

npm start
# /bin/bash
