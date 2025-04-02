FROM node:20.5.0-alpine3.18

WORKDIR /app/

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]