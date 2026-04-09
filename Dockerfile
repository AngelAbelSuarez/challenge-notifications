FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install 

# Copy source code
COPY . .

RUN npm run build

RUN ls -la

EXPOSE 3000


