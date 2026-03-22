ARG APP_PATH=/opt/outline

# Stage 1: instalar dependencias y compilar desde tu código
FROM node:20-alpine AS builder
ARG APP_PATH
WORKDIR $APP_PATH

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .
RUN yarn build

# Stage 2: imagen final solo con lo necesario
FROM node:20-alpine AS runner
ARG APP_PATH
WORKDIR $APP_PATH
ENV NODE_ENV=production

COPY --from=builder $APP_PATH/build ./build
COPY --from=builder $APP_PATH/server ./server
COPY --from=builder $APP_PATH/public ./public
COPY --from=builder $APP_PATH/.sequelizerc ./.sequelizerc
COPY --from=builder $APP_PATH/node_modules ./node_modules
COPY --from=builder $APP_PATH/package.json ./package.json

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs $APP_PATH/build

USER nodejs
EXPOSE 3000
CMD ["yarn", "start"]