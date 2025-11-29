// ...existing code...
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

    if (pin.trim() === "" || phone.trim() === "") {
      setMessage("PIN and Phone Number are required");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setMessage("Phone number must be 10 digits");
      return;
    }

    setLoading(true);
    try {
      // const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const cleanPhone =phone.trim();
      // store phone so OTP page can use it
      localStorage.setItem("phone", cleanPhone);

      const res = await axios.post("http://localhost:5000/api/send-otp", {
        phone: cleanPhone,
        pin,
      });

      console.log("send-otp response:", res.data);

      // store otp in localStorage for OTP page (dev/test only)
      if (res.data?.otp) {
        localStorage.setItem("otp", res.data.otp);
        alert(`OTP (DEV MODE): ${res.data.otp}`);
      }

      setMessage(res.data.message || "OTP sent successfully");
      navigate("/otp-verification");
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errMsg = error?.response?.data?.message || "Failed to send OTP. Check PIN & Phone";
      setMessage(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-purple-700 rounded-full blur-3xl opacity-20 absolute top-[-100px] left-[-200px] animate-pulse" />
        <div className="w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-20 absolute bottom-[-100px] right-[-150px] animate-pulse" />
      </div>

      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[400px] relative z-10 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Voter Registration</h1>

        <div className="flex flex-col space-y-5">
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

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {message && <p className="text-center text-green-400 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}
// ...existing code...