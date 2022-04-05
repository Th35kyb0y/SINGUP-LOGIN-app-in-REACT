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


// handling fetch post request for signup, registeration data from frontend process here
app.post('/register', (req,res)=>{
    // now we got data , thanx to body-parser
  let data = req.body;
  //backend validation
  //regExp of password
  const lowercase=/(?=.*[a-z])/;
  const oneUpperCase=/(?=.*[A-Z])/
  const oneNumber=/(?=.*[0-9])/
  const oneSpecialChar=/(?=.*[!@#$%^&*])/
  const minLength=/(?=.{8,})/
    //regExp of email patter
    let emailPattern=/[A-Za-z0-9_]{3,}@[a-z]{3,}[.][a-z]{2,3}/;
    // email
    let email=req.body.email;
    let password=req.body.password;
  //check if password matches with all conditions
  if(!lowercase.test(password)){
    res.send('add one lowercase')
      
}
else if(!oneUpperCase.test(password)){
    res.send('add one uppercase')
    
}
else if(!oneNumber.test(password)){
    res.send('add one number')
      
}
else if(!oneSpecialChar.test(password)){
    res.send('add one special char like @')
    
}

  // check if it matches or not , if not throgh error message
 else if(!emailPattern.test(email)){
      res.send('email is invalid')
  }
  else{
      // code runs if validation matches 
      // hash password
      // insert data in user collection of mongo db
const users= new mongoose.model('user',User)
// check if email already exist or not
users.findOne({email:email}).then((data)=>{
    if(data){
        res.status(500).send('email already exist')
        console.log('exist')
    }
else{
// async func here so we can use await in jwt getting func
    const func = async function(){

    // if email didnt exist , add new user
    // data we insert in users collection 
let data = new users(req.body)
// create token here , we call this func here so it will genrate jwt in register route
const token=  await data.getAuth();
// data.insertOne() used to insert, it is a promise func, insertOne is faster
data.save().then((result)=>{
  res.status(200).send("now you are registered , please login ")
}).catch((err)=>{
    console.log(err.message,'error in inserting')
})  
}
func()
}
})
 
  }
  
  //end of regsiter route
})
// login route , handling login request
app.post('/login',(req, res)=>{
    //getting login data
    let data= req.body;
    console.log('login request')
      //backend validation
  
     //regExp of email patter
     let emailPattern=/[A-Za-z0-9_]{3,}@[a-z]{3,}[.][a-z]{2,3}/;
     // email
     let email=req.body.email;
     let password=req.body.password;

  // email validation
 if(!emailPattern.test(email)){
      res.status(500).send('email is invalid')
    
  }
  else{
    // code runs if validation matches 
// check if email exist 
console.log(password)
const users= new mongoose.model('user',User) 
// check if email already exist or not
users.findOne({email:email}).then((data)=>{
    // if email exist , then check entered password is correct or not 
  if(password===data.password){
      // if password is correct , login successfully and render account
      // store token of this user in var , then send it in cookie to frontend
      let token=data.tokens[0].token;
      res.cookie('token',token,{
          expires:new Date(Date.now()+250000000),
          httpOnly:false // make it false if wants to read on client side using document.cookie
      })
          // res.cookie(zzzz)
     console.log('success', data)
      res.status(200).send('success login')
 
  }
else{
    res.status(500).send('password is incorrect')
}
}).catch((err)=>{
    res.status(500).send('email does not exist')
  
})
  }
})
// middleware for parsing cookies
app.use(cookieParse())
// handling homepage authentication 
// remember me authentication , login without filling form
app.post('/ggg',(req, res)=>{
// get token of cookie that user sends from browser
let token = req.cookies.token;
// verify it , if matches with any document records in db , fetch and send info to user of that record
// this line return id of matched document in db
let verifyToken= jwt.verify(token,"myjwtauthenticationrequires32charofsecretkey")
// fetching user based on id we get from verifyToken
// defined users here again , because findOne can only run on users collection
const users= new mongoose.model('user',User) 
users.findOne({_id:verifyToken._id}).then((data)=>{
    // sending email , of found user
    let stringData= JSON.stringify(data.email)
res.send(data.email)
console.log("jwt wrrors")
}).catch((err)=>{
    // if not found token in db , login message
    res.send('YOU NEED TO LOGIN / CREATE ACCOUNT')
})

})
app.post('/logout',(req,res)=>{
    
    res.clearCookie('token')
    res.end()
    console.log('logout')
})
// call the app
app.listen(port,()=>{
    console.log("app is listening on" + port + " port")
})
