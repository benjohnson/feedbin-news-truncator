FROM node:17-alpine AS builder
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY tsconfig.json /app
COPY src /app/src
RUN npm run build
RUN npm ci --production

FROM alpine AS runner
RUN apk add nodejs --no-cache
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
CMD node dist/main.js
