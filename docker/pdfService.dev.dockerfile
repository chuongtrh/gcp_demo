FROM node:8.9-alpine

RUN apk add --no-cache python make g++

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY microservices/pdfService /usr/src/app
COPY microservices/pdfService/package.json ./

RUN rm -rf /usr/src/app/node_modules

# Set Environment
ENV NODE_ENV=dev
# Force HummusJS build from source
# See https://github.com/galkahana/HummusJS/issues/230
RUN npm install --production --build-from-source=hummus && \
    rm -rf node_modules/hummus/src && \
    rm -rf node_modules/hummus/build

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]