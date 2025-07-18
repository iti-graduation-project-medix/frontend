import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./../pages/Home/Home";
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import Otp from "./../pages/OTP/Otp";
import SharedLayout from "./SharedLayout";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileRedirect from "../components/ProfileRedirect";
import NotFound from "../pages/NotFound/NotFound";
import OfflineRouteGuard from "../components/OfflineRouteGuard";

const Advertise = React.lazy(() => import("../pages/Advertise/Advertise"));
const ContactUs = React.lazy(() => import("../pages/ContactUs/ContactUs"));
const Deals = React.lazy(() => import("../pages/MyDeals/Deals"));
const Subscription = React.lazy(() => import("../pages/Subscription/Subscription"));
const AddPharmacy = React.lazy(() => import("../pages/AddPharmcy/AddPharmacy"));
const AvailableDeals = React.lazy(() => import("../pages/AvailableDeals/AvailableDeals"));
const DealDetails = React.lazy(() => import("../pages/AvailableDeals/DealDetails"));
const PharmaciesForSale = React.lazy(() => import("../pages/PharmaciesForSale/PharmaciesForSale"));
const PharmacyDetails = React.lazy(() => import("../pages/PharmaciesForSale/PharmacyDetails"));
const Settings = React.lazy(() => import("../pages/Settings/Settings"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Favorites = React.lazy(() => import("../pages/Favorites/Favorites"));
const SuccessPayment = React.lazy(() => import("./../pages/SuccessPayment/SuccessPayment"));
const FailedPayment = React.lazy(() => import("./../pages/FailedPayment/FailedPayment"));
const DealFormPage = React.lazy(() => import("../pages/DealForm/DealFormPage"));

export default function MainLayout() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/login"
              element={
                <OfflineRouteGuard>
                  <Login />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/signup"
              element={
                <OfflineRouteGuard>
                  <SignUp />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/advertise"
              element={
                <OfflineRouteGuard>
                  <Advertise />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/subscription"
              element={
                <OfflineRouteGuard>
                  <Subscription />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/subscription/:id/success"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <SuccessPayment />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/subscription/:id/failed"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <FailedPayment />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/otp"
              element={
                <OfflineRouteGuard>
                  <Otp message="Reset Password" />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/contact-us"
              element={
                <OfflineRouteGuard>
                  <ContactUs />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/deals"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <Deals />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/all-deals/:dealId"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <DealDetails />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/reset"
              element={
                <OfflineRouteGuard>
                  <ResetPassword />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/confirm-password"
              element={
                <OfflineRouteGuard>
                  <ConfirmPassword />
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/deals/new"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <DealFormPage />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/deals/edit/:id"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <DealFormPage />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/add-pharmacy"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <AddPharmacy />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/add-pharmacy/:id"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <AddPharmacy />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/all-deals"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <AvailableDeals />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/pharmacies-for-sale"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <PharmaciesForSale />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/pharmacies-for-sale/:id"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <PharmacyDetails />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <ProfileRedirect />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="/favorites"
              element={
                <OfflineRouteGuard>
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                </OfflineRouteGuard>
              }
            />
            <Route
              path="*"
              element={
                <OfflineRouteGuard>
                  <NotFound />
                </OfflineRouteGuard>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
