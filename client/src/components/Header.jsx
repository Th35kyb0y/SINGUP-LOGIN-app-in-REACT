// import navlink everywhere , where we are defining links , a 
// logic = 
// fetch req with cookie , and based on status code , we will verify user if logged in or not 
// to show login signup link or home link on header
// navlink for defining href , just like a tag with href
import{NavLink} from 'react-router-dom';
// useEffect for getting login status , useState for storing login status , then show links based on that
import { useEffect,useState } from 'react';

const Header=()=>{
// indicator of authenticating, state var
const [progress, setProgress] = useState("")
    //login status storing, default is false , so user cant see home link without auth
    const [islogin, setlogin]=useState(false)
    // func to fetch login auth from db , sending cookie if exist
    const auth= async ()=>{
      try{
        setProgress("Authenticating....")
        const req= await fetch('/ggg',{
            method:"post",
            headers:{
                'Content-Type':"application/json",
            },
            credentials:"include"
        })
        const res= await req
        
        // if login , status code will be 200 
        if(res.status==200){
            setlogin(true)

        }
        else{
          setlogin(false)
        }
}
catch(err){
  console.log(err.message)
}
finally{
  // hide progress bar
  setProgress("")
}
    }
    useEffect(()=>{
      
auth()
    },[])
    // logout func
    const logout = async()=>{
        let req = await fetch('/logout',{
            method:"post",
            headers:{
            'Content-Type':"application/json"
            },
            credentials:"include"
        })
        let res= await req
        if(res.status==200){
          // this line to refresh header , and redirrcr to home 
            window.location.href='/home'
        }
    }
    return(
        <>
        <h1>LOGO</h1>
        <span> {progress}</span>
{
islogin?<><NavLink  to='/home'>Home</NavLink><button onClick={logout}>LOGOUT</button></>: <> <NavLink to='login'>LOGIN</NavLink>
<NavLink to='/signup'>SIGNUP</NavLink></>
}

        
      
        </>
    )
}
export default Header;