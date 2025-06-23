import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
