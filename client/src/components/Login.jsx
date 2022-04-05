import{NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
// navigate hook for redirect if successfully login
import{ useNavigate} from 'react-router-dom';


const Login=(props)=>{
// indicator progress state var 
const [progress, setProgress] = useState("")
// error message of input fields
const [error,setError]=useState("")
    const [logVal, setlogVal]=useState({
        //predefine keys for inp
        email:'',
        password:''
    })
    // LOGIN button disable value
    let [value,setValue]=useState(true)
    // putting useNavigate in a var
    let redirect = useNavigate()
    //check if user is already login or not , if  login then redirect to homepage
    const check= async ()=>{
        try{
// sending post fetch req with cookie 
const res=  await fetch('/ggg',{
    method:"post",
    headers:{
        "Content-type":"application/json"
    },
    // this line for sending cookie
    credentials:"include"
})
const result= await res;
if(result.status!==200){
    redirect('/login');
    }
    else{
      // if user already  login or has remember me cookie stored ,he should redirect to home ,and prevent access to login page
window.location.href="/home"
    }
}
catch(err){
    console.log(err.message)
    console.log('you need to login')
}
}
// CHECK login status on every time  user refresh page
useEffect(()=>{check()},[])
// function for input validation with regExp
// we'll call this func on onInput , and onSubmit
const inpValidation= (inpField,inpValue)=>{
       //Data validation
    
  //regEXp tips=
  // 1. we use \back slash\
  // 2. less code , lots of funcsnality
  //3. /[A-Za-z._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z]{2,}/
  // [] isme range likhi h, {} isme limit, @ bich me h iske baad[.] aana chaiye then domain [] and its lenght limit 
  //{3,} means minimum 3 words hione chaiye max as much as wnt
 //[^abc] except these chars

 //1.email validation through regExp
 //regular expression pattern of validating email
 let emailPattern=/[A-Za-z0-9_]{3,}@[A-Za-z]{3,}[.]{1}[a-z]{2,3}/;
// check if entered email matched with regExp pattern and check if current inp field is email 
if(inpField=='email'){
    // if current inp is email then test pattern
if(emailPattern.test(inpValue)){
    setError('')
    // return true , we'll make it false to run fetch code on submit , if matched with pattern
     return true
}
else{
    setError('invalid email')
     // return false , we'll make it true to stop fetch code on submit , if dismatched with pattern
    return false
}
}
 
    
    
if(inpField=='password'){
    // password should not be blank , no regExp password validation here , because it can 
if(inpValue.length<1){
    setError('password should not be blank')
      return false
}
else{
    setError('')
      return true
}
}
// login input validation ends here
}
    const inpHandler=(e)=>{
        // capture input field 
        let inpName=e.target.name;
        // capture input value, and remove whitespaces from email and pass
        let inpVal=e.target.value.trim();
  // with spread operator, ...logVal, update keys, to see what user is typing
  setlogVal({...logVal,[inpName]:inpVal});
  //calling inputValidation function , passing current input field and its value
  inpValidation(inpName,inpVal)
  // enable login button only if all fields has been fullfill
  if(logVal.email.length>1&& logVal.password.length>1){
    setValue(false) 
}
else{
    setValue(true)
}
 
}

    const loginHandler= async (e)=>{
        e.preventDefault()

        // stop data sending if input didnt matched with regExp
        // it is converted false to true , because false is indicating invalid entry(discmatch with regExp)
        if(! inpValidation('email',logVal.email)){
console.log('email is invalid')
return false
        }
        else if (!inpValidation('password',logVal.password)){
alert('password is blank')
return false 
        }
        else{
                  // indicator value ,to show user , login request is sending...
        setProgress("Logging...")
        try{
          // remove white space before and after of email 
        
          console.log(logVal.email)
        let formData=JSON.stringify(logVal)
        
        let setting ={
            method:'POST',
            headers:{
            
                'Content-Type': 'application/json',
            },
            body:formData

         }
        //step3 sending data and storing response in response var
        let response = await fetch('/login',setting);
        // waiting for response then parsing it in text() or json()
        let data = await response; // no need to convert response in json or text , to check status code
// if status is 200 means user is logged in
if(data.status===200){
alert(await data.text())    // use await here to avoid pending promise result
// redirect user to home page (component)
//redirect has useNavigate hook
//redirect('/home')
// we are usiing location href to update state to show home navbar and hide login signup link
window.location.href="/home"
}
else{
  
  alert(await data.text())
}
    // this is try block
    }
        // error handling from try block
        catch(err){
            console.log(err.message) 
            
        }
        finally{
          // hide indicator ,and show result
          setProgress("")}
    }
} 
    return(
        <>
        
        <h1>Login here</h1>
    <form onSubmit={loginHandler}>
    <span className="error"> {error}</span><br />
<input type='text' name='email' placeholder='Email' value={logVal.email} onChange={inpHandler}/>
<input type='text'  name='password' placeholder='Password' value={logVal.password} onChange={inpHandler}/>

<button disabled={value}>LOGIN</button>
<br />
<span>{progress} </span>
 </form>
      </>
    )
}
export default Login;