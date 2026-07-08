FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./
COPY shared/package.json ../shared/
COPY shared/src ../shared/src/
COPY shared/tsconfig.json ../shared/

RUN npm install -w backend -w shared

COPY backend/src ./src/
COPY backend/tsconfig.json ./

RUN npm run build -w shared && npm run build -w backend

EXPOSE 3001

CMD ["node", "dist/index.js"]
