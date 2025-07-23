import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { SignUpForm } from "./../../components/SignUpForm";
import { LoadingPage } from "@/components/ui/loading";
import { Helmet } from 'react-helmet-async';

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/deals");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated || isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Dawaback Medical Community</title>
        <meta name="description" content="Join Dawaback to access secure pharmacy deals, medicine exchange, and professional networking for pharmacists." />
        <meta name="keywords" content="sign up, register, Dawaback, pharmacist, pharmacy, medicine exchange, join, تسجيل, انضمام, دواباك, صيدلي, صيدلية, تبادل أدوية" />
        <link rel="canonical" href="https://dawaback.com/auth/signup" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dawaback.com/auth/signup" />
        <meta property="og:title" content="Sign Up | Dawaback Medical Community" />
        <meta property="og:description" content="Join Dawaback to access secure pharmacy deals, medicine exchange, and professional networking for pharmacists." />
        <meta property="og:image" content="https://dawaback.com/og-image.jpg" />
        <meta property="og:site_name" content="Dawaback" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dawaback.com/auth/signup" />
        <meta name="twitter:title" content="Sign Up | Dawaback Medical Community" />
        <meta name="twitter:description" content="Join Dawaback to access secure pharmacy deals, medicine exchange, and professional networking for pharmacists." />
        <meta name="twitter:image" content="https://dawaback.com/og-image.jpg" />
      </Helmet>
      <div className="min-h-svh ">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl text-primary md:text-4xl font-bold  mb-3">
              Join Our Medical Community
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create your secure account to access comprehensive healthcare
              services and connect with medical professionals
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
            {/* Left Side - Welcome Section */}

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-7/12">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
