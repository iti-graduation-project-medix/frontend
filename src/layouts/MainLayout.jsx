import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Layout Components
import SharedLayout from "./SharedLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import SubscriptionRoute from "../components/SubscriptionRoute";
import ProfileRedirect from "../components/ProfileRedirect";

// Main Pages
import Home from "./../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import UnderReview from "../pages/UnderReview/UnderReview";

// Authentication Pages
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";

import OfflineRouteGuard from "../components/OfflineRouteGuard";
import InstallApp from "@/components/InstallApp";

import Otp from "./../pages/OTP/Otp";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy Loaded Components
const Advertise = React.lazy(() => import("../pages/Advertise/Advertise"));
const ContactUs = React.lazy(() => import("../pages/ContactUs/ContactUs"));
const Subscription = React.lazy(() =>
  import("../pages/Subscription/Subscription")
);
const SuccessPayment = React.lazy(() =>
  import("./../pages/SuccessPayment/SuccessPayment")
);
const FailedPayment = React.lazy(() =>
  import("./../pages/FailedPayment/FailedPayment")
);
const PaymentStatusPage = React.lazy(() =>
  import("../pages/Subscription/PaymentStatusPage")
);

// User Management Pages
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Settings = React.lazy(() => import("../pages/Settings/Settings"));
const Favorites = React.lazy(() => import("../pages/Favorites/Favorites"));

// Deals Management Pages
const Deals = React.lazy(() => import("../pages/MyDeals/Deals"));
const AvailableDeals = React.lazy(() =>
  import("../pages/AvailableDeals/AvailableDeals")
);
const DealDetails = React.lazy(() =>
  import("../pages/AvailableDeals/DealDetails")
);
const DealFormPage = React.lazy(() => import("../pages/DealForm/DealFormPage"));

// Pharmacy Management Pages
const AddPharmacy = React.lazy(() => import("../pages/AddPharmcy/AddPharmacy"));
const PharmaciesForSale = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmaciesForSale")
);
const PharmacyDetails = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmacyDetails")
);

// Communication Pages
const Chat = React.lazy(() => import("../pages/Chat/Chat"));
const TermsOfService = React.lazy(() => import("../pages/TermsOfService"));
const PrivacyPolicy = React.lazy(() => import("../pages/PrivacyPolicy"));
import UserManual from "../pages/UserManual/UserManual";

export default function MainLayout() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="under-review" element={<UnderReview />} />
            <Route path="user-manual" element={<UserManual />} />

            {/* Authentication Routes */}
            <Route path="auth">
              <Route
                path="login"
                element={
                  <OfflineRouteGuard>
                    <Login />
                  </OfflineRouteGuard>
                }
              />
              <Route
                path="signup"
                element={
                  <OfflineRouteGuard>
                    <SignUp />
                  </OfflineRouteGuard>
                }
              />
              <Route path="reset-password">
                <Route
                  index
                  element={
                    <OfflineRouteGuard>
                      <ResetPassword />
                    </OfflineRouteGuard>
                  }
                />
                <Route
                  path="confirm"
                  element={
                    <OfflineRouteGuard>
                      <ConfirmPassword />
                    </OfflineRouteGuard>
                  }
                />
                <Route
                  path="verify-otp"
                  element={
                    <OfflineRouteGuard>
                      <Otp message="Reset Password" />
                    </OfflineRouteGuard>
                  }
                />
              </Route>
            </Route>

            {/* Public Service Routes */}
            <Route path="/advertise" element={<Advertise />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="privacy" element={<PrivacyPolicy />} />

            {/* Subscription Routes */}
            <Route path="subscription">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <OfflineRouteGuard>
                      <Subscription />
                    </OfflineRouteGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="status"
                element={
                  <ProtectedRoute>
                    <OfflineRouteGuard>
                      <PaymentStatusPage />
                    </OfflineRouteGuard>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected User Routes */}
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <OfflineRouteGuard>
                    <Settings />
                  </OfflineRouteGuard>
                </ProtectedRoute>
              }
            />
            <Route path="me">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <OfflineRouteGuard>
                      <ProfileRedirect />
                    </OfflineRouteGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <OfflineRouteGuard>
                      <Profile />
                    </OfflineRouteGuard>
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="pharmacists/:id"
              element={
                <ProtectedRoute>
                  <OfflineRouteGuard>
                    <Profile />
                  </OfflineRouteGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <SubscriptionRoute>
                    <OfflineRouteGuard>
                      <Favorites />
                    </OfflineRouteGuard>
                  </SubscriptionRoute>
                </ProtectedRoute>
              }
            />

            {/* Protected My Deals Routes */}
            <Route
              path="my-deals"
              element={
                <ProtectedRoute>
                  <SubscriptionRoute>
                    <OfflineRouteGuard>
                      <Deals />
                    </OfflineRouteGuard>
                  </SubscriptionRoute>
                </ProtectedRoute>
              }
            />

            {/* Protected Deals Routes */}
            <Route path="deals">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <AvailableDeals />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <DealFormPage />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <DealDetails />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <DealFormPage />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Pharmacy Routes */}
            <Route path="pharmacies">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <PharmaciesForSale />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <AddPharmacy />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <PharmacyDetails />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <OfflineRouteGuard>
                        <AddPharmacy />
                      </OfflineRouteGuard>
                    </SubscriptionRoute>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* NotFound Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>

        {/* Global Chat Widget */}
        <OfflineRouteGuard>
          <Chat />
        </OfflineRouteGuard>
        <InstallApp />
      </div>
    </Router>
  );
}
