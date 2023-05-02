FROM node:16
RUN apt-get update && apt-get -y install sudo
RUN npm install -g yarn webpack webpack-cli --force