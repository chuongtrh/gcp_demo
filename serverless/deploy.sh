#! /bin/bash
Color_Off='\033[0m'       # Text Reset
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue

#! /bin/bash
Color_Off='\033[0m'       # Text Reset
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue

echo -e "Start deploy ..."

cd ./pdf
echo -e "${Yellow} 1. Deploy pdf"
echo -e "${Color_Off}"
npm run deploy

cd ..
cd ./updatePDF
echo -e "${Yellow} 2. Deploy updatePDF"
echo -e "${Color_Off}"
npm run deploy

cd ..

echo -e "${Green} Deploy completed. \nList functions:"
echo -e "${Color_Off}"

gcloud functions list