# gcp_demo

# Run cloud build & deploy
gcloud builds submit --config cloudbuild.yaml .

<!-- # Run app deploy
gcloud app deploy server/app.yaml -->

# Run load test http request

[siege](https://www.bigbluedoor.net/blog/benchmarking-siege)
siege -d1 -c240 balmy-channel-211708.appspot.com/api/users

[ab](https://httpd.apache.org/docs/2.4/programs/ab.html)
ab -c 100 -n 5000 balmy-channel-211708.appspot.com/api/users