FROM node:12-alpine as base
ENV workdir=/home/node/app
RUN mkdir -p ${workdir} && chown -R node:node ${workdir}
WORKDIR ${workdir}

FROM base as builder
# add bcrypt build dependencies
RUN apk --no-cache add --virtual builds-deps build-base python git
USER node
COPY package*.json ./
RUN npm install --production


FROM base
USER node
# copy node_modules from builder
COPY --chown=node:node --from=builder ${workdir} .
COPY --chown=node:node app app
COPY --chown=node:node config config
COPY --chown=node:node public public
COPY --chown=node:node migrations migrations

EXPOSE 7000
CMD [ "node", "src/index.js" ]
