# gcp_demo

# Run cloud build
gcloud builds submit --config cloudbuild.yaml .

# Run app deploy
gcloud app deploy server/app.yaml