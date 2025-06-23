import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PiTagChevronBold } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";

export default function ProfileHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-16 shadow-md">
            <AvatarImage src="/public/avatars/client1.webp" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {/* Verified badge */}
          <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
            <BsPatchCheckFill size={22} className="text-blue-500" title="Verified Account" />
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">Account Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account settings and preferences</p>
        </div>
      </div>
      <Button className="h-10 px-6 rounded-lg font-semibold text-base shadow-md flex items-center">
        <PiTagChevronBold size={18}/>
        My Deals
      </Button>
    </div>
  );
} 