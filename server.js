// get express 
const express = require('express');
//body parser for parsing fetch request body, else it will show undefined
var bodyParser = require('body-parser');
// jwt for storing token , for auth
const jwt = require("jsonwebtoken");
const path = require("path");
//cookie parser
const cookieParse=require('cookie-parser');
const mongoose = require('mongoose');
// our cloud MongoDb url
// put express in app variable
const app = express();
app.use(cookieParse())
// port number , env for heroku
let port = 5000||process.env.PORT;

// if we are sending json then bodyparser.json , if sending form data use encodeded
app.use(bodyParser.json())
// serve static files from frontend build/static , ( for deploying in heroku)
app.use( express.static(path.join(__dirname,'/client/build')))
// whatever the url , /url , it will redirect to index.html of reactjs
app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname,"client/build","index.html"))
}) 



app.listen(port,()=>{
    console.log("app is listening on" + port + " port")
    })
