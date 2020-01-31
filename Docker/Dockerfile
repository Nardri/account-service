ARG NODE_VERSION=13.7-slim

FROM node:${NODE_VERSION} AS base

FROM base AS builder

WORKDIR /build

COPY ./package* ./

COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile


FROM base

RUN apt-get update && apt-get install -y netcat

WORKDIR /usr/src/app

COPY --from=builder /build/node_modules /usr/src/app/node_modules

COPY --from=envoyproxy/envoy:latest /usr/local/bin/envoy /usr/local/bin/envoy
COPY ./Docker/envoy.yaml /etc/envoy/envoy.yaml

COPY . .

RUN chmod +x ./Docker/entrypoint.sh

CMD sh ./Docker/entrypoint.sh
