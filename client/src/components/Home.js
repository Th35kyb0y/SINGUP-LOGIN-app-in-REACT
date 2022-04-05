// import useEffect
import {useEffect, useState} from 'react';
import Header from './Header';
// import useNavigate  for , if not found any login record send user to login page
import{ useNavigate} from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const  Home= ()=>{
  
    const [isLogin, setLogin]=useState(false)
    // define history hook in home component, history is changed to useNavigate
    const history = useNavigate()
// state variable for storing email value from fetch req , user info , will be welcome name for user
    let [email, setemail] =useState('')
    // check if logged in
    // send cookie if exist
    // verify in backend and if cookie match with any record of user , fetch info , ( successfully logged in)
    // useEfeect will run every first time page visit , to check login state , by performing fetch request7

    // we make check func here because it needs to be async and useEffect me hum async nahi kar sakte
    const check= async ()=>{
        try{
// sending get fetch req with cookie 
const res=  await fetch('/ggg',{
    method:"post",
    headers:{
        "Content-type":"application/json"
    },
    // this line for sending cookie
    credentials:"include"
})
const result= await res;
if(result.status==200){
  
let name = await result.text()// split string from @ and make array of first and last  name , and remove @
let nameArr = name.split("@")// show first name of email as welcome name 
setemail('Hello ' + nameArr[0])
setLogin(true)
console.log(result)

}
else{
    setemail('You need to login to access this page')
}

        }
        catch(err){
            console.log(err.message)
            console.log('you need to login')
history('/login')
        }
    }
useEffect(()=>{
check()
},[])
// empty array means , it will run every time user refresh page
return(
    <>
        <h1>{email}</h1>
        </>
)
}
export default Home;