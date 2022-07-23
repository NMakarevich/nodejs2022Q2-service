FROM node:16-alpine3.14
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 4000
RUN npx prisma generate
CMD ["npm", "run", "start:dev"]
RUN npx prisma migrate --name first-migration
