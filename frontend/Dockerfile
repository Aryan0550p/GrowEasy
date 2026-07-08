FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src/

RUN npm install

COPY frontend ./frontend

WORKDIR /app/frontend
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
