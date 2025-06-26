import React from "react";
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

export default function SecurityCard({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};

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
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="current-password"
              className="text-xs font-medium uppercase"
            >
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              className="mt-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="new-password"
              className="text-xs font-medium uppercase"
            >
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              className="mt-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="confirm-password"
              className="text-xs font-medium uppercase"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              className="mt-1"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end pt-4 flex flex-col items-center gap-2">
        <Button className="px-6 py-2 rounded-md text-base self-end max-sm:m-auto">
          Update Password
        </Button>
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
