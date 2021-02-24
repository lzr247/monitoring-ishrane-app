# monitoring-ishrane-app
Aplikacija za monitoring ishrane - MongoDB Atlas, Express, Vue.js + Vuetify, Node
# link to heroku
```
https://monitoring-ishrane.herokuapp.com/
```
# Project setup
You will need to install dependencies both from root directory and client folder with command:
```
npm install
```
After that, you'll need to add new environment variable in form name:value.
```
monitoringIshrane_jwtPrivateKey:mySecureKey
```
You will need two terminals to run the application. 
In the first terminal, change directory to client folder and then run:
```
npm run serve
```
In the second terminal, change directory to server folder and then run:
```
node index.js
```
