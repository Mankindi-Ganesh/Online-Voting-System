import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/Register';
import OTPVerificationPage from './components/OTPVerification';
import CandidatesList from './Pages/CandidatesList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/candidates-list" element={<CandidatesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
