import React from "react";
import { User2, CheckCircle2, MessageCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdvertiserInfo({ owner, pharmacyId }) {
  // Get initials for fallback
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const initials = getInitials(owner?.fullName);

  // Chat logic (from ContactOptions)
  const { startChat, setIsWidgetOpen, loadUserChats, selectChat, chats } =
    useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const currentUserId = (() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
      const parsedUser = JSON.parse(user);
      return typeof parsedUser === "object" ? parsedUser.id : parsedUser;
    } catch {
      return null;
    }
  })();

  const isOwner = currentUserId && owner && currentUserId === owner.id;

  const handleChat = async () => {
    if (!currentUserId || !owner || !pharmacyId) {
      alert("Please login to start a chat");
      return;
    }

    setIsChatLoading(true);
    try {
      // Start chat with the pharmacy owner
      await startChat(currentUserId, owner.id, pharmacyId, "pharmacy", {
        fullName: owner.fullName,
        profilePhotoUrl: owner.profilePhotoUrl,
        role: owner.role || "User",
      });
      await loadUserChats();
      // Find the new chat in the list (by pharmacyId or userId)
      const chatToSelect = chats.find(
        (c) => c.pharmacy?.id === pharmacyId || c.otherUser?.id === owner.id
      );
      if (chatToSelect) {
        await selectChat(chatToSelect);
      }
      setIsWidgetOpen(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleProfile = () => {
    if (owner?.id) {
      navigate(`/pharmacists/${owner.id}`);
    } else {
      alert("Pharmacist profile not available");
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-border p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar with Status */}
        <div className="relative">
          <Avatar className="size-20 shadow-md border-2 border-white dark:border-background">
            {owner?.profilePhotoUrl ? (
              <AvatarImage src={owner.profilePhotoUrl} alt={owner.fullName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover dark:from-primary dark:to-primary-hover text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          {owner?.isIdVerified && (
            <div className="absolute -bottom-1 -right-1 bg-transparent rounded-full p-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>
          )}
        </div>
        {/* Name and Verification */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">
              {owner?.fullName || "Pharmacy Owner"}
            </h3>
            {owner?.isIdVerified && (
              <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Professional Pharmacist
          </p>
        </div>
        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button
            onClick={handleChat}
            className={`w-full bg-primary hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center justify-center gap-2 ${
              isOwner || isChatLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isOwner || isChatLoading}
            title={
              isOwner
                ? "You cannot chat with yourself"
                : isChatLoading
                ? "Starting chat..."
                : `Chat with ${owner?.fullName?.split(" ")[0] || "Owner"}`
            }
          >
            {isChatLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <span>
              {isChatLoading
                ? "Starting chat..."
                : `Chat with ${owner?.fullName?.split(" ")[0] || "Owner"}`}
            </span>
          </Button>
          <Button
            onClick={handleProfile}
            variant="outline"
            className="w-full border border-primary text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 font-semibold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center justify-center gap-2"
            title="View all listings by this owner"
          >
            <User2 className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
