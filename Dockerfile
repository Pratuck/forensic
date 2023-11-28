FROM node:18.7.0-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY .env ./
COPY babel.config.cjs ./
COPY playwright.config.ts ./
COPY ./ ./
RUN npm i
CMD ["npm", "start"]