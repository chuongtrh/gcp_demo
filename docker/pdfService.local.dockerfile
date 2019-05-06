FROM node:8.9-alpine

RUN apk add --no-cache python make g++

RUN apk update && apk upgrade && \
    echo http://nl.alpinelinux.org/alpine/v3.8/community >> /etc/apk/repositories && \
    echo http://nl.alpinelinux.org/alpine/v3.8/main >> /etc/apk/repositories && \
    apk add --no-cache \ 
      chromium \
      nss \
      freetype \
      harfbuzz \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY microservices/pdfService /usr/src/app
RUN rm -rf /usr/src/app/src/test
# RUN rm -rf /usr/src/app/node_modules

# Install app dependencies
COPY microservices/pdfService/package*.json ./


# Set Environment
ENV NODE_ENV=dev
ENV IS_DOCKER=1

# Force HummusJS build from source
# See https://github.com/galkahana/HummusJS/issues/230
RUN npm config set unsafe-perm true

RUN npm install --production --build-from-source=hummus && \
    rm -rf node_modules/hummus/src && \
    rm -rf node_modules/hummus/build

# Bundle app source
COPY . .

RUN npm install puppeteer@1.9.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser


EXPOSE 4400
CMD [ "npm", "start" ]