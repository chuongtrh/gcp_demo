FROM node:8.9-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY server /usr/src/app
RUN rm -rf /usr/src/app/src/config/local.js
RUN rm -rf /usr/src/app/src/test


# Install app dependencies
# COPY package.json .
COPY server/package.json ./

# Set Environment
ENV NODE_ENV=dev

RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start"]