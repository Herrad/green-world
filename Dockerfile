FROM node:0.10-onbuild

ADD "npm i"
ADD "grunt"

EXPOSE 3000