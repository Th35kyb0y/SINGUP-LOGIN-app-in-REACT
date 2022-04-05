// get express 
const express = require('express');
//body parser for parsing fetch request body, else it will show undefined
var bodyParser = require('body-parser');
// jwt for storing token , for auth
const jwt = require("jsonwebtoken");
const path = require("path");
//cookie parser
const cookieParse=require('cookie-parser');
const app = express();
// port number , env for heroku
let port = 5000||process.env.PORT;



app.listen(port,()=>{
    console.log("app is listening on" + port + " port")
    })
