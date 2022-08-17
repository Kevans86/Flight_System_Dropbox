import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { HashRouter as BRouter} from 'react-router-dom';
import { BrowserRouter as BRouter} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
