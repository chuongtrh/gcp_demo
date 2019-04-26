# gcp_demo
Setup CI/CD for project with both client & server running on GCP

# How to run in local
```
$ npm install
$ npm run start:local
```

# Run cloud build & deploy
```
$ npm run deploy:dev
```

# Run load test http request

[siege](https://www.bigbluedoor.net/blog/benchmarking-siege)
```
$ siege -r100 -d1 -c250 balmy-channel-211708.appspot.com/api/users
```

[ab](https://httpd.apache.org/docs/2.4/programs/ab.html)
```
$ ab -c 100 -n 5000 balmy-channel-211708.appspot.com/api/users
```
