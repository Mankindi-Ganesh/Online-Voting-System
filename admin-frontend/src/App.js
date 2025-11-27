import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admindashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
