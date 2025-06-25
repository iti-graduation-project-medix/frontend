import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./../pages/Home/Home";
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import Advertise from "../pages/Advertise/Advertise";
import ContactUs from "./../pages/ContactUs/ContactUs";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import Otp from "./../pages/OTP/Otp";
import SharedLayout from "./SharedLayout";
import Deals from "../pages/Deals/Deals";
import Subscription from "../pages/Subscription/Subscription";
import Notfound from "../pages/not-found/notFound";
import DealFormPage from "../pages/DealForm/DealFormPage";
import Profile from "../pages/Profile/Profile";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";
import { DealDetails } from "../pages/Deals/DealDetails";

export default function MainLayout() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/otp" element={<Otp message="Reset Password" />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<DealDetails />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/deal-form" element={<DealFormPage />} />
            <Route path="*" element={<Notfound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
