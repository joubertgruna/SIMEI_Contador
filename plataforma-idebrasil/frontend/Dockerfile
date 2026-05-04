## Multi-stage build: build React app then serve with nginx
FROM node:20-bullseye AS builder
WORKDIR /app

# copy package files and install
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# copy sources and build. Accept an optional REACT_APP_API_URL build-arg
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

FROM nginx:stable-alpine

# Copy built site
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config to enable API proxy
COPY nginx.conf /etc/nginx/nginx.conf

# Add entrypoint script that will write runtime envs into /usr/share/nginx/html/env-config.js
COPY docker/env-entrypoint.sh /docker-entrypoint.d/env-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/env-entrypoint.sh

EXPOSE 80
CMD ["/docker-entrypoint.d/env-entrypoint.sh"]