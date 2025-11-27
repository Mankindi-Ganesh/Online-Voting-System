import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./components/Register";
import OTPVerificationPage from "./components/OTPVerification";
import VotePage from "./components/VotePage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/vote-page" element={<VotePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
