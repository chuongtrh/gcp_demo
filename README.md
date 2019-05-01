# gcp_demo
Setup CI/CD for project with both client & server running on GCP

# Setup with App Engine
## How to run in local
```
$ npm install
$ npm run start:local
```

## Run cloud build & deploy
```
$ npm run deploy:app
```

# Setup with Cloud Run
## How to run in local
```
$ npm install
$ npm run start:local
```

## Run cloud build & deploy
```
$ npm run deploy:cloudrun
```


# Run load testing http request

[siege](https://www.bigbluedoor.net/blog/benchmarking-siege)
```
$ siege -r100 -d1 -c250 YOUR_URL/api/users
```

[ab](https://httpd.apache.org/docs/2.4/programs/ab.html)
```
$ ab -c 100 -n 5000 YOUR_URL/api/users
```

[artillery](https://artillery.io/docs/getting-started/)
```
$ artillery quick -c 100 -n 100 -d 1 YOUR_URL/api/users
```

# Setup with Cloud Function

# Reference
* https://hackernoon.com/serverless-moderate-fun-with-modular-functions-df98ca6cb981