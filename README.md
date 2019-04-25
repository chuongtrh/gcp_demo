# gcp_demo

# Run cloud build
gcloud builds submit --config cloudbuild.yaml .

# Run app deploy
gcloud app deploy server/app.yaml

# Run test http request
siege -d1 -c200 http://balmy-channel-211708.appspot.com/api/users