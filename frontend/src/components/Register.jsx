import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setMessage("");

    // Basic validation
    if (pin.trim() === "" || phone.trim() === "") {
      setMessage("PIN and Phone Number are required");
      return;
    }
    if (phone.length !== 10) {
      setMessage("Phone number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/send-otp", {
        phone,
        pin,
      });

      console.log("send-otp response:", res.data);

      if (res.data.otp) {
        alert(`OTP (DEV MODE): ${res.data.otp}`); // Since no SMS system
      }

      setMessage(res.data.message || "OTP sent successfully");

      // Navigate only if OTP sent
      navigate("/otp-verification");

    } catch (error) {
      console.error("Error:", error);
      const errMsg =
        error?.response?.data?.message ||
        "Failed to send OTP. Check PIN & Phone";

      setMessage(errMsg);
      alert(errMsg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-purple-700 rounded-full blur-3xl opacity-20 absolute top-[-100px] left-[-200px] animate-pulse" />
        <div className="w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-20 absolute bottom-[-100px] right-[-150px] animate-pulse" />
      </div>

      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[400px] relative z-10 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Voter Registration</h1>

        <div className="flex flex-col space-y-5">

          {/* PIN */}
          <div>
            <label className="block text-sm font-semibold mb-2">PIN Number</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* Message */}
          {message && (
            <p className="text-center text-green-400 mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}