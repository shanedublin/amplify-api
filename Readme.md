
# Running locally without docker
nodemon app.js 192.168.182.1 password

# Building the docker image

docker build -t rushanedublin/amplify-api .

## running on docker

docker-compose up

## Notes  
Make sure you change the ip and the password in the  `.env` file or this will not work
