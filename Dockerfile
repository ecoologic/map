FROM node:12
MAINTAINER Erik Ecoologic

RUN apt-get update

RUN mkdir /app
WORKDIR /app

COPY . .
