FROM node:20-alpine as builder
WORKDIR /app

COPY package.json ./
RUN npm i
COPY . .
RUN ["npx", "drizzle-kit", "generate"] 
RUN ["npx", "drizzle-kit", "migrate"]
RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
