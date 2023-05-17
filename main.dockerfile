FROM node:16
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 8080
COPY . .
CMD [ "npm", "run", "run" ]