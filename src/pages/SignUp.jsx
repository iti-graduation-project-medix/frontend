import React from "react";
import { SignUpForm } from "../components/signUP-form";

export default function SignUp() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl">
        {" "}
        {/* Increased max width */}
        <SignUpForm />
      </div>
    </div>
  );
}
