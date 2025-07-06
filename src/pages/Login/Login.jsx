import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm";
import { useAuth } from "../../store/useAuth";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate("/all-deals");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
