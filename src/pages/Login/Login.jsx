import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm";
import { useAuth } from "../../store/useAuth";
import { LoadingPage } from "@/components/ui/loading";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate("/deals");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated || isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return (
    <div className=" flex lg:my-15 md:my-10 flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
