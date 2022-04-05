import{useState} from 'react';
{
    //flow-
    // while inputting- capture val, store in state
    // show state value, in inp value attr , with inpHandler
    // update state val by setRegVal({...RegVal, e.tar.name : e.tar.val})
    // onSubmit= stringify RegVal in new obj , then send to backend with fetch api

}

const Signup=()=>{
  // indicator progress state var 
const [progress, setProgress] = useState("")
// error message of input fields
const [error,setError]=useState("")
// signUP button disable value
     let [value,setValue]=useState(true)
         // obj of inp valued, call useState only in component
const [regVal, setregVal]=useState({
    //predefine keys for inp
    email:'',
    password:'',
    repeatPass:'',
 

})
     // INPUT valudation function
     const inpValidation= (inpField,inpValue)=>{
//1.email validation through regExp
 //regular expression pattern of validating email
 let emailPattern=/[A-Za-z0-9_]{3,}@[A-Za-z]{3,}[.]{1}[a-z]{2,3}/;
// check if entered email matched with regExp pattern and check if current inp field is email 
if(inpField=='email'){
    // if current inp is email then test pattern
if(emailPattern.test(inpValue)){
  // if entered wrong email ,then right , so hide error msg
  setError("")
    // return true , we'll make it false to run fetch code on submit , if matched with pattern
     return true
}
else{
    setError('invalid email')
     // return false , we'll make it true to stop fetch code on submit , if dismatched with pattern
    return false
}
}
// 2 password validation
   const lowercase=/(?=.*[a-z])/;
   const oneUpperCase=/(?=.*[A-Z])/
   const oneNumber=/(?=.*[0-9])/
   const oneSpecialChar=/(?=.*[!@#$%^&*])/
   const minLength=/(?=.{8,})/
   // check if entered email matched with regExp pattern and check if current inp field is email 
if(inpField=='password'){
   // added ! so we can test multiple regExp and return true only once
if(!lowercase.test(inpValue)){
   setError('add one lowercase in password')
     return false
}
else if(!oneUpperCase.test(inpValue)){
    setError('add one uppercase in password')
      return false
}
else if(!oneNumber.test(inpValue)){
    setError('add one number in password')
      return false
}
else if(!oneSpecialChar.test(inpValue)){
    setError('add one special char like @ in password')
      return false
}
else if(!minLength.test(inpValue)){
    setError('password should be 8 character long')
      return false
}
else{
    setError('')
    // if email invalid , disable btn
     return true
}
// check if repeat password same as password

}
if(inpField=='repeatPass'){
if(inpValue===regVal.password){
  // logic is if here is returning false ,
  // then calling time true return karega
setError('')
return false; 
}
else{
    setError('password not match')
     return true
}
}

     }





    //will run on keypress in inp field
    const inpHandler=(e)=>{
// capture input field 
let inpName=e.target.name;
// capture input value, rmv space
let inpVal=e.target.value.trim();
// with spread operator, ...regVal, update keys
setregVal({...regVal,[inpName]:inpVal});
inpValidation(inpName, inpVal)
 // enable signup button only if all fields has been fullfill
 if(regVal.email.length>1&& regVal.password.length>1){
    setValue(false) 
}
else{
    setValue(true)
}
    }
    // will run onSubmit and fetch to backend
    const  handleSignup=async (e)=>{
        e.preventDefault()

        
          // stop data sending if input didnt matched with regExp
        // it is converted false to true , because false is indicating invalid entry(discmatch with regExp)
        if(! inpValidation('email',regVal.email)){
            alert('email is invalid')
            return false
                    }
                    else if (!inpValidation('password',regVal.password)){
            alert('password is invalid')
            return false
                    }
                    else if(inpValidation('repeatPass',regVal.repeatPass)){
                        alert('password not matched')
                        return false
                    }
                    else{
  // if every validation done , then = 
       // show signing up , when user clicked for sign up
         setProgress("signing up...")
        // to prevent unexpected error use try block in fetch func
        try{
       // console.log(enableD)
       
        // first remove repeat password property from regVal
        delete regVal.repeatPass
        // stringify inputted value in json formate
        
        let formData=JSON.stringify(regVal);
        console.log('signup ', regVal)
        // steps of fetch post 
        // add proxy key in react package json
        // add expressjs address in it , eg. http://localhost:5000
        // add just route eg. /sent , instead of full address
        //1 make async func
        //2 setting define karna for fetch eg. methods , headers, body
        //3 fetch request with url and setting 
        //4 error handling 
        //5 response check

        //step2 headers and post method related info
        let setting={method:"post",headers:{"Content-type":"application/json"},body:formData}
        //step3 sending data and storing response in response var
        let response = await fetch('/register',setting);
           // waiting for response then parsing it in text() or json()
           let data = await response;
          
// response from server ,use await ,else show promisw object
alert(await data.text())
           if(data.status==200){
              // showing redirecting to login msg ,after successfully registration
           setProgress("sign up successfull , redirecting to login page....")
             window.location.href="/login"
           }
           // if any error of email existing=
           else{
setregVal({...regVal,password:'', repeatPass:""});
           }
    // this is try block
    }
        // error handling from try block
        catch(err){
            console.log(err)
        }
        finally{
          // hide indicator
          setProgress("")
        }
    }
    }

    return(
        <>
        <h1>Join us , sing up here</h1>
        <form onSubmit={handleSignup}>
            {// value 
        }
<span className="error"> {error}</span>
<br />
<input type='text' name='email' placeholder='Email' value={regVal.email} onChange={inpHandler} />
<input type='text' name='password' placeholder='Password' value={regVal.password} onChange={inpHandler}/>
<input type='text' name='repeatPass' placeholder='Repeat Password' value={regVal.repeatPass} onChange={inpHandler}/>  

<button disabled={value}>SIGN UP</button>
<br />
<span> {progress}</span>
 </form>
        </>
    )
}
export default Signup;