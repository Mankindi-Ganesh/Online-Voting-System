import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setMessageType("");

    if (username.trim() === "" || password.trim() === "") {
      setMessage("Username and Password are required");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      if (res.data.success) {
        setMessage("Login successful");

        setMessageType("success");
        navigate("/admin/dashboard");
      } else {
        setMessage(res.data.message || "Invalid credentials");
        setMessageType("error");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Login failed. Try again.";
      setMessage(errMsg);
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-purple-700 rounded-full blur-3xl opacity-20 absolute top-[-100px] left-[-200px] animate-pulse" />
        <div className="w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-20 absolute bottom-[-100px] right-[-150px] animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[400px] relative z-10 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

        <div className="flex flex-col space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center mt-2 font-semibold ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
