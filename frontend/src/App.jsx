// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainAdmin from './components/MainAdmin'
import Users from './components/Users';
import SubAdmin from './components/SubAdmin'
import WelcomePage from './components/WelcomePage';

// import other pages as needed (e.g., Dashboard, AdminPanel, etc.)

function App() {
  return (
  
      <Routes>
        {/* Public route */}
          <Route path="/" element={<WelcomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main-admin" element={<MainAdmin/>} />
            <Route path="/sub-admin" element={<SubAdmin/>} />
            <Route path="/department" element={<Users/>} />
        {/* Example additional routes (you can change these as needed) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}

        {/* 404 Not Found route (optional) */}
        {/* <Route path="*" element={<NotFound />} /> */}
       
      </Routes>
   
  );
}

export default App;
