FROM node:8.11-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install --production --silent
COPY . /usr/src/app
EXPOSE 7000
CMD [ "node", "app.js" ]
