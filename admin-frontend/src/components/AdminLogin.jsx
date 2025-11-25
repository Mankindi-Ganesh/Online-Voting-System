import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace the baseURL if needed
      const { data } = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("adminToken", data.token);
      alert("Login successful!");
      onLogin(); // Callback to parent (e.g., redirect to dashboard)
    } catch (err) {
      alert(err.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
