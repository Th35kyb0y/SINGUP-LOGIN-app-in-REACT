// get express 
const express = require('express');
//body parser for parsing fetch request body, else it will show undefined
var bodyParser = require('body-parser');
// jwt for storing token , for auth
const jwt = require("jsonwebtoken");
const path = require("path");
//cookie parser
const cookieParse=require('cookie-parser');
// database setup 
// cloud db of md, mongodb connection 
// everything same except connecting , connecting requires url of our cloud db 
// first require moongose , moongose is odm , means it convert js object to mongodb bson and also using mongodb command is unsafe here thats 
// why we use it

const mongoose = require('mongoose');
// our cloud MongoDb url
const db = 'mongodb+srv://th35kyb0y:hustler@cluster0.snw7f.mongodb.net/moodie?retryWrites=true&w=majority';
// connect db , and returns a promise , using then() , catch if err occurs
mongoose.connect(db).then(()=>{
    console.log('connected to db')
}).catch((err)=>{
    console.log(err.message,'connection failed')
})
// our db collection schema , 
const User= mongoose.Schema({
    email:{type:String, required:true , unique:true},
    password:{type:String, required:true},
    tokens:[{token:{type:String,
    required:true}}]
})
// schema for mood database collection
const Mood=mongoose.Schema({
label:{type:String},
link:{type:Array}
})

//defining getAuth and storing it in db and returning token
// methods stand for instance of User(schema) , just like this stand for current obj
User.methods.getAuth=async function(){
    //"this" refers collection here 
try{
// genrate token using mongodb doc id , and secret key of yours , that can be any 32char long string
const token = jwt.sign({_id:this._id.toString()},"myjwtauthenticationrequires32charofsecretkey")
// storing this token in db
this.tokens=this.tokens.concat({token});
// store using save()
await this.save()
// now we wll use this token to authenticate this user and fetch data of this token
// here this refers to current instance of user schema
return token

}
catch(err){
console.log(err)
}
}
// put express in app variable
const app = express();
app.use(cookieParse())
// port number , env for heroku
let port = 5000||process.env.PORT;

// if we are sending json then bodyparser.json , if sending form data use encodeded
app.use(bodyParser.json())
// serve static files from frontend build/static , ( for deploying in heroku)
app.use( express.static(path.join(__dirname,'/frontend/build')))
// whatever the url , /url , it will redirect to index.html of reactjs
app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend/build","index.html"))
})

app.listen(port,()=>{
    console.log("app is listening on" + port + " port")
    })
