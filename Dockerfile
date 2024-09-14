FROM node:18-alpine

ARG NODE_ENV
ARG BUILD_TIME
ARG COMMIT_HASH

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN chown -R node:node /home/node/app
USER node

RUN yarn && yarn build

ENV AWS_REGION=us-east-2
ENV NODE_ENV=${NODE_ENV}
ENV BUILD_TIME=${BUILD_TIME}
ENV PORT=3000
ENV COMMIT_HASH=${COMMIT_HASH}
EXPOSE 3000

CMD ["node", "dist/main.js"]
