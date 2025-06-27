import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaLock } from "react-icons/fa";
import { useAuth } from "@/store/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SecurityCard({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};

  const { changePassword, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState("");

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  return (
    <Card className="p-6 shadow-lg rounded-2xl border border-gray-200 max-w-xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle>
          <span className="inline-flex items-center gap-3 font-bold text-lg tracking-wide">
            <span
              className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm"
              style={{ width: 36, height: 36 }}
            >
              <FaLock size={18} className="text-primary" />
            </span>
            Change Password
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmNewPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setSuccess("");
            clearError();
            try {
              await changePassword(values);
              setSuccess("Password updated successfully.");
              resetForm();
            } catch (err) {
              // error handled by zustand
            }
          }}
        >
          {({ handleSubmit }) => (
            <>
              <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="current-password" className="text-xs font-medium uppercase">
                    Current Password
                  </Label>
                  <Field
                    as={Input}
                    id="current-password"
                    name="oldPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="mt-1"
                  />
                  <ErrorMessage name="oldPassword" component="div" className="text-red-600 text-xs font-medium" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="new-password" className="text-xs font-medium uppercase">
                    New Password
                  </Label>
                  <Field
                    as={Input}
                    id="new-password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-600 text-xs font-medium" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="confirm-password" className="text-xs font-medium uppercase">
                    Confirm New Password
                  </Label>
                  <Field
                    as={Input}
                    id="confirm-password"
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                  <ErrorMessage name="confirmNewPassword" component="div" className="text-red-600 text-xs font-medium" />
                </div>
                {error && (
                  <div className="text-red-600 text-sm font-medium">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm font-medium">{success}</div>
                )}
                <Button
                  className="px-6 py-2 rounded-md text-base self-end max-sm:m-auto"
                  type="submit"
                  formNoValidate={false}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </CardContent>
      <CardFooter className="justify-end pt-4 flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm flex items-center gap-2 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8"
            />
          </svg>
          For any assistance with your account, please contact support.
        </span>
      </CardFooter>
    </Card>
  );
}
