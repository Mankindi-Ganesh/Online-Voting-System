import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const phone = localStorage.getItem("phone");
      if (!phone) {
        alert("Phone not found. Please register first.");
        return navigate("/register");
      }

      // if register stored otp in localStorage (dev), use it and show popup
      const storedOtp = localStorage.getItem("otp");
      if (storedOtp) {
        setOtp(storedOtp);
        alert(`Your OTP (dev): ${storedOtp}`);
        return;
      }

      // otherwise request a new OTP from backend (dev will return otp)
      try {
        const res = await axios.post("http://localhost:5000/api/send-otp", { phone });
        if (res.data?.otp) {
          localStorage.setItem("otp", res.data.otp);
          setOtp(res.data.otp);
          alert(`Your OTP (dev): ${res.data.otp}`);
        } else {
          setMessage(res.data?.message || "OTP sent");
        }
      } catch (err) {
        console.error("Failed to send OTP:", err);
        setMessage("Failed to send OTP. Try again.");
      }
    }
    init();
  }, [navigate]);

  const handleVerifyOTP = async () => {
    const phone = localStorage.getItem("phone");
    const inputOtp = otp.trim();
    if (!phone) {
      alert("Phone number not found. Please register first.");
      return navigate("/register");
    }
    if (!/^\d{6}$/.test(inputOtp)) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { phone, otp: inputOtp });
      if (res.data?.success) {
        // store voter id for later actions
        if (res.data.voterId) {
          localStorage.setItem("voterId", res.data.voterId);
        }
        // remove raw otp after verification for security
        localStorage.removeItem("otp");
        alert(res.data.message || "OTP verified successfully");
        navigate("/vote-page");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      const errMsg = error?.response?.data?.message || "OTP verification failed";
      alert(errMsg);
    }
  };

  // ...existing JSX (input, Verify button wired to handleVerifyOTP) ...
// ...existing code...


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-green-700 rounded-full blur-3xl opacity-20 absolute top-[-100px] left-[-200px] animate-pulse" />
        <div className="w-[400px] h-[400px] bg-teal-600 rounded-full blur-3xl opacity-20 absolute bottom-[-100px] right-[-150px] animate-pulse" />
      </div>

      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[400px] relative z-10 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center">OTP Verification</h1>

        <div className="flex flex-col space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">6-digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
          >
            Verify OTP
          </button>

          {message && (
            <p className="text-red-500 text-center mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
