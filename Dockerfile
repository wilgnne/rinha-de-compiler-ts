FROM node:18 AS builder

WORKDIR /app

COPY * ./
RUN yarn --frozen-lockfile
RUN yarn build

FROM node:18 AS app

WORKDIR /app

COPY --from=builder /app/dist ./
COPY ./__tests__/closure_resources/fib.json /var/rinha/source.rinha.json

CMD ["node", "index.js", "/var/rinha/source.rinha.json"]
