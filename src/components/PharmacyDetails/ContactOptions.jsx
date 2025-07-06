import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function ContactOptions({ owner }) {
  // Placeholder for chat logic
  const handleChat = () => {
    alert(`Start chat with ${owner?.fullName || "owner"}`);
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleChat}
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg cursor-pointer hover:scale-105 transition-transform animate-pulse"
      >
        <MessageCircle className="w-7 h-7" />
        Chat with me
      </Button>
    </div>
  );
}
