
FROM node:16.16.0-alpine3.16
RUN set -x
RUN apk update && apk add --no-cache make protobuf-dev
ARG package_name
WORKDIR /usr/app
RUN mkdir -p $package_name/src
WORKDIR /usr/app/$package_name

COPY ./src ./src/
COPY *.json ./

RUN npm install -g typescript
RUN npm install
RUN npm run build