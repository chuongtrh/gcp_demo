FROM node:8.9-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY microservices/pdfService /usr/src/app

# Install app dependencies
# COPY package.json .
COPY microservices/pdfService/package*.json ./

# Set Environment
ENV NODE_ENV=local

RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 4400

CMD [ "npm", "start"]