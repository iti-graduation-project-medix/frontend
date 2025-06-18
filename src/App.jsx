import Advertise from "./pages/Advertise/Advertise";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Otp from "./pages/OTP/Otp";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<div>Sign Up</div>} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/otp" element={<Otp message="Reset Password" />} />
        </Routes>
      </div>
    </Router>
  );
}
