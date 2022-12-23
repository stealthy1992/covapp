import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ResultContextProvider } from './context/ResultContextProvider'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from './components/SignIn'
import Dashboard from './components/Dashboard';
import { ProvinceStatsContextProvider } from './context/ProvinceStatsContextProviders';
import ProvinceStats from './components/ProvinceStats';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ProvinceStatsContextProvider>
    <ResultContextProvider>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="provincestats" element={<ProvinceStats />} />
        </Routes>
    </ResultContextProvider>
    </ProvinceStatsContextProvider>
  </BrowserRouter>
  
   
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
