############################
# Base envoy alpine image #
###########################
FROM envoyproxy/envoy-alpine:latest AS base_image

# install required packages
RUN apk update && apk add --no-cache netcat-openbsd \
  && apk add --update nodejs npm

# copy envoy config
COPY ./Docker/envoy.yaml /etc/envoy/envoy.yaml


############################
#     Dependency Build    #
###########################
FROM base_image AS builder

# set build directory
WORKDIR /build

# copy package.json
COPY ./package*.json ./

# install dependencies
RUN npm install


############################
#    Main App Build       #
###########################
FROM base_image

# set app directory
WORKDIR /usr/src/app

# copy node modules from previous build to this build
COPY --from=builder /build/node_modules /usr/src/app/node_modules

# copy the rest of the application
COPY . .

# make the entrypoint scriot executable
RUN chmod +x ./Docker/entrypoint.sh

# set the docker command
CMD sh ./Docker/entrypoint.sh
