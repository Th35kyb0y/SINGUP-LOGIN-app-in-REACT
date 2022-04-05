import React from 'react';
import ReactDOM from 'react-dom';
// browser router for single page app func, for render compo , instead of pages
import {BrowserRouter} from 'react-router-dom';
import App from './App';

ReactDOM.render(
  // browser route me sare component 
  <BrowserRouter>
   <App />
  </BrowserRouter>,
  document.getElementById('root')
);
