
FROM node:16.16.0-alpine3.16

RUN set -x
ARG package_name
WORKDIR /usr/app
RUN mkdir -p $package_name/src $package_name/test
WORKDIR /usr/app/$package_name

COPY ./src ./src/
COPY ./test ./src/
COPY *.json ./



RUN npm install
RUN npm run build

ENTRYPOINT [ "npm" ]
CMD [ "run", "start:prod" ]