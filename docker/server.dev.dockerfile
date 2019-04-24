FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# COPY package.json .
COPY package*.json ./

# Set Environment
ENV NODE_ENV=dev

RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 4300

CMD [ "npm", "start" ]