FROM node:8.9-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY server /usr/src/app
COPY .version /usr/src/app

# Install app dependencies
# COPY package.json .
COPY server/package*.json ./

# Set Environment
ENV NODE_ENV=dev

RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 4300

CMD [ "npm", "start" ]