//components-
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
// home page after login
import Home from './components/Home';
//import route and routes for defining href ,for single page app like func
import{Route, Routes} from 'react-router-dom';
import {useState} from 'react';

function App() {
  return (
    <> 
    {
      // header with logo//
      
    } 
    <Header />
 {
   // inside routes define route , route defines path and render specific compo for specific path
 }
    <Routes>

    {//  <Route path='/about' element={<Header />} />
}
      <Route path='/login' element={<Login />} />
      
      <Route path='/signup' element={<Signup />} />
   <Route  path='/home' element={<Home />} />
    </Routes>

       </>
     
    
  );
 
}


export default App;
