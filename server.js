// get express 
const express = require('express');
//body parser for parsing fetch request body, else it will show undefined

// jwt for storing token , for aut
const path = require("path");

const app = express();
// port number , env for heroku
let port = 5000||process.env.PORT;
// serve static files from frontend build/static , ( for deploying in heroku)
app.use( express.static(path.join(__dirname,'/client/build')))



app.listen(port,()=>{
    console.log("app is listening on" + port + " port")
    })
