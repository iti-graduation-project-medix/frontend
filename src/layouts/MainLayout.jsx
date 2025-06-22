import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./../pages/Home/Home";
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import Advertise from "../pages/Advertise/Advertise";
import ContactUs from "./../pages/ContactUs/ContactUs";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import Otp from "./../pages/OTP/Otp";
import SharedLayout from "./SharedLayout";
import Subscription from "../pages/Subscription/Subscription";

export default function MainLayout() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/otp" element={<Otp message="Reset Password" />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/reset" element={<ResetPassword />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
