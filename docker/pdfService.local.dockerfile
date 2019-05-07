FROM node:8.9-alpine

RUN apk add --no-cache python make g++

RUN apk update && apk upgrade && \
    echo http://nl.alpinelinux.org/alpine/v3.8/community >> /etc/apk/repositories && \
    echo http://nl.alpinelinux.org/alpine/v3.8/main >> /etc/apk/repositories && \
    apk add --no-cache \ 
      ttf-freefont \
      chromium \
      nss

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Create app directory
WORKDIR /usr/src/app

COPY microservices/pdfService /usr/src/app
COPY microservices/pdfService/package.json ./

RUN rm -rf /usr/src/app/node_modules

# Set Environment
ENV NODE_ENV=dev
ENV IS_DOCKER=1


# Force HummusJS build from source
# See https://github.com/galkahana/HummusJS/issues/230
RUN npm install --production --build-from-source=hummus && \
    rm -rf node_modules/hummus/src && \
    rm -rf node_modules/hummus/build

# Bundle app source
COPY . .

# Puppeteer v1.9.0 works with Chromium 68.
RUN npm install puppeteer@1.9.0


EXPOSE 4400

CMD [ "npm", "start" ]