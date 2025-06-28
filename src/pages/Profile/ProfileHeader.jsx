import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PiTagChevronBold } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function ProfileHeader({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((word) => word[0]?.toUpperCase()).join("");
  };
  const initials = getInitials(details.fullName || "");

  // Capitalize first character of each word
  const capitalizeWords = (str = "") =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  console.log(pharmacistDetails);
  return (
    <div className="flex flex-col items-center gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-16 shadow-md">
            {/* <AvatarImage src="/public/avatars/client1.webp" alt="Profile" /> */}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {/* Verified badge */}
          <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
            <BsPatchCheckFill
              size={22}
              className="text-blue-500"
              title="Verified Account"
            />
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            {capitalizeWords(details.fullName)}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      <Link
        to="/deals"
        className="bg-primary text-white h-10 px-6 rounded-lg font-semibold text-base shadow-md flex items-center w-full sm:w-auto sm:ml-4"
      >
        <PiTagChevronBold className="mr-2" size={18} />
        My Deals
      </Link>
    </div>
  );
}
