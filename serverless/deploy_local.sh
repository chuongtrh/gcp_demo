#! /bin/bash
Color_Off='\033[0m'       # Text Reset
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue


echo -e "${Blue} Start emulator"
functions start

echo -e "Start deploy ..."

cd ./pdf
echo -e "${Yellow} 1. Deploy pdf"
echo -e "${Color_Off}"
npm run deploy:local

cd ..
cd ./updatePDF
echo -e "${Yellow} 2. Deploy updatePDF"
echo -e "${Color_Off}"
npm run deploy:local

cd ..

echo -e "${Green} Deploy completed"
echo -e "${Color_Off}"