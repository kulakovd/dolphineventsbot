FROM node:20-alpine as backend-builder

WORKDIR /app
COPY apps/dolphin-backend/package.json apps/dolphin-backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY apps/dolphin-backend .
RUN yarn build
# remove dev dependencies before copying to production image
RUN yarn install --frozen-lockfile --production

FROM node:20-alpine as frontend-builder

WORKDIR /app
COPY apps/dolphin-mini-app/package.json apps/dolphin-mini-app/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY apps/dolphin-mini-app .
RUN yarn build

FROM node:20-alpine

WORKDIR /dist
COPY --from=backend-builder /app/dist .
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json .
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["yarn", "prod:start"]
