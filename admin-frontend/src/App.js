import React, { useState } from "react";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("adminToken"));

  return loggedIn ? <Dashboard /> : <AdminLogin onLogin={() => setLoggedIn(true)} />;
};

export default App;
