FROM node:16-alpine3.14
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE ${PORT}
RUN npx prisma generate
CMD ["npm", "run", "server"]

