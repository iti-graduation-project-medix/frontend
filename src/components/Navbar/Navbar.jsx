import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "./navbar.module.css";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FiBell } from "react-icons/fi";
import { Heart } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import useChat from "../../store/useChat";
import { useOffline } from "../../hooks/useOffline";
import { useFav } from "../../store/useFav";
import {
  listenToDrugAlerts,
  removeDrugAlertListener,
  getSocket,
} from "../../services/socket";
import drugAlertService from "../../services/drugAlert";
import { ModeToggle } from "../mode-toggle";
import { X } from "lucide-react";
import { useUserDetails } from "../../store/useUserDetails";
import { FaSpinner } from "react-icons/fa";

export default function Navbar() {
  const isOffline = useOffline();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] =
    useState(false);
  const [drugAlertNotifications, setDrugAlertNotifications] = useState([]);
  const [unreadDrugAlerts, setUnreadDrugAlerts] = useState(0);
  const { user, isAuthenticated, logout, initializeAuth, token } = useAuth();
  const {
    userDetails,
    fetchUserDetails,
    isLoading: userDetailsLoading,
  } = useUserDetails();
  const [imgLoaded, setImgLoaded] = useState(false);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const { favorites, fetchFavorites } = useFav();
  const [toastNotification, setToastNotification] = useState(null);
  const toastTimeoutRef = useRef(null);
  const lastToastIdRef = useRef(null);
  const location = useLocation();

  // Toast Notification position: below bell icon
  const bellRef = useRef(null);
  const [toastPosition, setToastPosition] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();
  const MotionLink = motion.create(Link);
  const {
    pharmacistDetails,
    isLoading,
    error,
    fetchPharmacistDetails,
    clearError,
  } = usePharmacist();

  // Use real unread messages count from chat store
  const unreadCount = useChat((state) => state.totalUnreadCount);
  const { loadUserChats, initializeSocket, getCurrentUserId } = useChat();

  useEffect(() => {
    if (isAuthenticated && user && user.id && token && !userDetails) {
      fetchUserDetails(user.id, token);
    }
  }, [isAuthenticated, user, token, fetchUserDetails, userDetails]);

  useEffect(() => {
    if (user && token) {
      // Ensure we always pass the user id, not the whole object
      const userId = typeof user === "object" && user !== null ? user.id : user;
      if (userId) {
        fetchPharmacistDetails(userId, token);
      }
    }
  }, [user, token, fetchPharmacistDetails]);

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  // Load chats when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        initializeSocket();
        loadUserChats();
      }
    }
  }, [isAuthenticated, initializeSocket, loadUserChats, getCurrentUserId]);

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  // Handle drug alert notifications
  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      // Load existing notifications
      const loadDrugAlertNotifications = async () => {
        try {
          const notifications =
            await drugAlertService.getDrugAlertNotifications();
          setDrugAlertNotifications(notifications);

          // Calculate unread count from loaded notifications
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          setUnreadDrugAlerts(unreadCount);
        } catch (error) {
          console.error("Error loading drug alert notifications:", error);
          // Don't clear notifications on auth error, just log it
          if (!error.message.includes("Authentication required")) {
            setDrugAlertNotifications([]);
            setUnreadDrugAlerts(0);
          }
        }
      };

      loadDrugAlertNotifications();

      // Setup WebSocket listener for real-time updates
      const setupDrugAlertListener = () => {
        const socket = getSocket();

        if (socket?.connected) {
          // Make sure user is in their personal room
          if (user?.id) {
            socket.emit("joinRoom", { roomId: user.id, userId: user.id });
          }

          listenToDrugAlerts(async (data) => {
            // Check if this alert is for the current user
            if (data.user?.id !== user?.id) {
              return;
            }

            // Defer heavy operations to prevent blocking
            const processDrugAlert = async () => {
              // Refresh notifications from API to get the complete data
              try {
                const notifications =
                  await drugAlertService.getDrugAlertNotifications();
                setDrugAlertNotifications(notifications);

                // Calculate unread count from fresh data
                const unreadCount = notifications.filter(
                  (n) => !n.isRead
                ).length;
                setUnreadDrugAlerts(unreadCount);
              } catch (error) {
                console.error("Error refreshing notifications:", error);

                // Fallback: create temporary notification
                const newNotification = {
                  id: data.dealId || `temp-${Date.now()}`,
                  title: data.title,
                  message: data.message,
                  dealId: data.dealId,
                  isRead: false,
                  createdAt: new Date().toISOString(),
                  user: data.user,
                };
                setDrugAlertNotifications((prev) => {
                  const updatedNotifications = [newNotification, ...prev];
                  const newUnreadCount = updatedNotifications.filter(
                    (n) => !n.isRead
                  ).length;
                  setUnreadDrugAlerts(newUnreadCount);
                  return updatedNotifications;
                });
              }
            };

            // Defer processing to prevent blocking
            if (window.requestIdleCallback) {
              window.requestIdleCallback(() => processDrugAlert(), {
                timeout: 100,
              });
            } else {
              setTimeout(() => processDrugAlert(), 0);
            }
          }, user?.id);
        }
      };

      // Try to setup listener immediately
      setupDrugAlertListener();

      // Also setup listener when socket connects
      const socket = getSocket();
      if (socket) {
        socket.on("connect", () => {
          setupDrugAlertListener();
        });
      }

      // Setup polling as fallback (every 30 seconds)
      const pollingInterval = setInterval(async () => {
        try {
          const notifications =
            await drugAlertService.getDrugAlertNotifications();
          const unreadCount = notifications.filter((n) => !n.isRead).length;

          setDrugAlertNotifications(notifications);
          setUnreadDrugAlerts(unreadCount);
        } catch (error) {
          console.error("Error polling notifications:", error);
          // Don't clear notifications on auth error
          if (error.message.includes("Authentication required")) {
            // Stop polling if user is not authenticated
            clearInterval(pollingInterval);
          }
        }
      }, 30000); // 30 seconds

      return () => {
        removeDrugAlertListener();
        clearInterval(pollingInterval);
      };
    }
  }, [isAuthenticated, token, user?.id]);

  // Show toast when a new notification arrives
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!drugAlertNotifications.length) return;
    // Find the latest unread notification
    const latest = drugAlertNotifications.find((n) => !n.isRead);
    if (
      latest &&
      latest.id !== lastToastIdRef.current &&
      (!toastNotification || toastNotification.id !== latest.id)
    ) {
      setToastNotification(latest);
      lastToastIdRef.current = latest.id;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    }
    // Cleanup on unmount
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [drugAlertNotifications, isAuthenticated]);

  // Reset toast on manual close
  useEffect(() => {
    if (!toastNotification) return;
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toastNotification]);

  // Do NOT show toast again on route change
  useEffect(() => {
    setToastNotification(null);
  }, [location.pathname]);

  useEffect(() => {
    if (toastNotification && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setToastPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [toastNotification]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/auth/login");
  };

  const handleMenuClick = () => {
    setIsUserMenuOpen(false);
  };

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      // Only call API if it's a real notification (not temp ID)
      if (!notificationId.startsWith("temp-")) {
        await drugAlertService.markAsRead(notificationId);
      }

      // Update local state immediately for better UX
      setDrugAlertNotifications((prev) => {
        const updatedNotifications = prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        // Update unread count based on all notifications
        const newUnreadCount = updatedNotifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadDrugAlerts(newUnreadCount);
        return updatedNotifications;
      });

      // Refresh from API to ensure consistency
      setTimeout(async () => {
        try {
          const notifications =
            await drugAlertService.getDrugAlertNotifications();
          setDrugAlertNotifications(notifications);
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          setUnreadDrugAlerts(unreadCount);
        } catch (error) {
          console.error(
            "Error refreshing notifications after mark as read:",
            error
          );
        }
      }, 500);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkNotificationAsRead(notification.id);

    // Close the popover
    setIsNotificationPopoverOpen(false);

    // Navigate to deal details if available
    if (notification.dealId) {
      setTimeout(() => {
        navigate(`/deals/${notification.dealId}`);
      }, 100);
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const burgerVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 90, scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((word) => word[0]?.toUpperCase()).join("");
  };

  // Add a handler to close the menu when any item is clicked
  const handleMobileMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  // Custom style for hiding scrollbar
  const hideScrollbarStyle = {
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE 10+
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const menuList = document.querySelector(
      ".fixed.inset-0 .flex-1.overflow-y-auto"
    );
    const indicator = document.getElementById("mobile-menu-scroll-indicator");
    if (menuList && indicator) {
      const checkScroll = () => {
        if (
          menuList.scrollHeight > menuList.clientHeight &&
          menuList.scrollTop + menuList.clientHeight <
            menuList.scrollHeight - 10
        ) {
          indicator.style.opacity = "1";
        } else {
          indicator.style.opacity = "0";
        }
      };
      checkScroll();
      menuList.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        menuList.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [isMenuOpen]);

  return (
    <nav
      className=" border-gray-200 "
      style={{ paddingTop: isOffline ? "2rem" : "0" }}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse focus:outline-none min-w-0"
        >
          <style>{`
            @media (max-width: 405px) {
              .navbar-logo-compact { height: 28px !important; min-width: 20px !important; max-width: 28px !important; }
              .navbar-title-compact { font-size: 1rem !important; max-width: 70px !important; }
              .navbar-slogan-compact { display: none !important; }
            }
          `}</style>
          <img
            src="/logo.svg"
            className="h-10 sm:h-10 lg:h-14 xl:h-16 transition-all duration-200 min-w-0 max-w-[40px] sm:max-w-[48px] lg:max-w-[56px] xl:max-w-[64px] navbar-logo-compact"
            alt="Dawaback Logo"
            style={{ minWidth: 24 }}
          />
          <div className="flex flex-col mb-2 md:mb-3 min-w-0">
            <span className="font-bold text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap text-primary dark:text-white transition-all duration-200 navbar-title-compact">
              Dawaback
            </span>
            <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-zinc-700 ms-.5 leading-0 mt-1 dark:text-gray-400 transition-all duration-200 navbar-slogan-compact">
              Before it expires, trade it with desire
            </p>
          </div>
        </Link>
        <div className="flex items-center md:order-2 space-x-2 xs:space-x-3 md:space-x-0 rtl:space-x-reverse min-w-0">
          {/* Theme Mode Toggle and Notification Bell */}
          <div
            className={`flex items-center gap-1 xs:gap-2 ${
              !isAuthenticated ? "mr-4 md:mr-2 xs:mr-6" : "mr-2 md:mr-2"
            }`}
          >
            <ModeToggle />
            {isAuthenticated && (
              <Popover
                open={isNotificationPopoverOpen}
                onOpenChange={setIsNotificationPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative ">
                    <FiBell className="h-5 w-5 xs:h-[1.2rem] xs:w-[1.2rem] text-zinc-600 dark:text-white" />
                    {unreadDrugAlerts > 0 && (
                      <Badge className="absolute bottom-6 left-4 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[24px] h-[24px] flex items-center justify-center">
                        {unreadDrugAlerts}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 font-bold text-lg flex items-center gap-2  text-primary dark:text-primary tracking-wide">
                    <svg
                      className="w-5 h-5 text-primary dark:text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                      />
                    </svg>
                    Drug Alerts
                  </div>
                  {drugAlertNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto bg-white/95 dark:bg-gray-900/95 custom-scrollbar">
                      {drugAlertNotifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={`p-4 cursor-pointer text-sm transition-colors flex flex-col gap-1 rounded-lg mx-2 my-2 shadow-sm border border-transparent ${
                            !notification.isRead
                              ? "bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40"
                              : "bg-white/80 dark:bg-card border-gray-100 dark:border-gray-800"
                          } hover:bg-primary/20 dark:hover:bg-primary/30 hover:border-primary/50 dark:hover:border-primary/60`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-foreground">
                                {notification.title}
                              </span>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1 animate-pulse"></div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-gray-600 dark:text-white bg-white/95 dark:bg-gray-900/95">
                      <svg
                        className="mx-auto mb-2 w-8 h-8 text-gray-600 dark:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                        />
                      </svg>
                      No drug alert notifications
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
          {isAuthenticated ? (
            <>
              <div></div>
              {/* Favorites Icon */}
              <Link
                to="/favorites"
                className="relative font-bold mr-3 hidden md:inline-flex"
              >
                <Button variant="outline" size="icon" className="relative">
                  <Heart className="h-5 w-5 xs:h-[1.2rem] xs:w-[1.2rem] text-zinc-600 dark:text-white" />
                  <span className="sr-only">Favorites</span>
                </Button>
                {favorites.deals.length + favorites.pharmacies.length > 0 && (
                  <Badge className="absolute bottom-6 left-4 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[24px] h-[24px] flex items-center justify-center">
                    {favorites.deals.length + favorites.pharmacies.length}
                  </Badge>
                )}
              </Link>
              {/* Avatar and Dropdown */}
              <div className="relative flex items-center hidden md:flex">
                <motion.button
                  ref={userButtonRef}
                  type="button"
                  className="flex items-center justify-center mr-2 text-xl bg-primary rounded-full md:me-0 focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/30 relative"
                  style={{
                    width: "clamp(36px, 8vw, 46px)",
                    height: "clamp(36px, 8vw, 46px)",
                  }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileTap="tap"
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative">
                    {(userDetailsLoading ||
                      !userDetails ||
                      !userDetails.profilePhotoUrl ||
                      !imgLoaded) && (
                      <span className="absolute inset-0 flex items-center justify-center z-10">
                        <FaSpinner
                          className="animate-spin text-primary"
                          size={20}
                        />
                      </span>
                    )}
                    {userDetails && userDetails.profilePhotoUrl && (
                      <AvatarImage
                        src={userDetails.profilePhotoUrl}
                        alt="Profile"
                        onLoad={() => setImgLoaded(true)}
                        style={{ display: imgLoaded ? "block" : "none" }}
                      />
                    )}
                  </Avatar>
                </motion.button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      ref={userMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="z-50 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-full"
                    >
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">
                          {user?.fullName ||
                            user?.name ||
                            pharmacistDetails?.fullName ||
                            "User"}
                        </span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          {user?.email ||
                            pharmacistDetails?.email ||
                            "user@example.com"}
                        </span>
                      </div>
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <Link
                            to="/me"
                            onClick={handleMenuClick}
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                              location.pathname === "/me" ||
                              location.pathname.startsWith("/me/")
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            }`}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/deals"
                            onClick={handleMenuClick}
                            className={`block px-4 py-2 text-sm ${
                              location.pathname === "/deals"
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            }`}
                          >
                            Deals
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/pharmacies"
                            onClick={handleMenuClick}
                            className={`block px-4 py-2 text-sm ${
                              location.pathname === "/pharmacies"
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            }`}
                          >
                            Pharmacies
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/settings"
                            onClick={handleMenuClick}
                            className={`block px-4 py-2 text-sm ${
                              location.pathname === "/settings"
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            }`}
                          >
                            Settings
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4 max-md:hidden">
              <MotionLink
                to="/auth/login"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-primary/30 font-medium rounded-md text-sm px-4 py-2  dark:hover:bg-[var(--primary-hover)] focus:outline-none "
              >
                Login
              </MotionLink>
              <MotionLink
                to="/auth/signup"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-4 py-2 dark:bg-input/30 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Sign up
              </MotionLink>
            </div>
          )}
          <motion.button
            type="button"
            className="relative inline-flex items-center justify-center md:hidden border border-gray-200 dark:border-border bg-white dark:bg-card rounded-md w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 -ms-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={isMenuOpen ? "open" : "closed"}
            whileTap="tap"
            whileHover="hover"
            variants={burgerVariants}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-[1.2rem] h-[1.2rem] text-zinc-600 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                key="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              {/* Fullscreen Menu */}
              <motion.div
                key="mobile-menu"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
                className="fixed inset-0 z-[9999] flex flex-col h-full bg-background dark:bg-background justify-start"
              >
                {/* Close button */}
                <button
                  className="absolute top-6 right-6 text-3xl text-gray-700 dark:text-gray-200 hover:text-primary focus:outline-none"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  style={{ zIndex: 10000 }}
                >
                  &times;
                </button>
                {/* Centered logo */}
                <div className="flex flex-col items-center mt-12 mb-10">
                  <img
                    src="/logo.svg"
                    alt="Dawaback Logo"
                    className="h-16 mb-2"
                  />
                  <span className="font-bold text-3xl text-primary dark:text-white">
                    Dawaback
                  </span>
                </div>
                {/* Scrollable menu list */}
                <div
                  className="flex-1 w-full overflow-y-auto max-h-[calc(100vh-12rem)] px-2 scrollbar-hide"
                  style={hideScrollbarStyle}
                >
                  <style>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                  `}</style>
                  <ul className="flex flex-col font-semibold gap-4 text-2xl w-full max-w-sm mx-auto items-center relative">
                    {/* Main Navigation */}
                    {isAuthenticated ? (
                      <>
                        <li>
                          <Link
                            to="/"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 hover:text-white dark:text-gray-100 rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                            aria-current="page"
                          >
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/advertise"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/advertise"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 hover:text-white transition-colors  dark:text-gray-100 rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                          >
                            Advertise
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/contact"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/contact"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 hover:text-white transition-colors  dark:text-gray-100 rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                          >
                            Contact
                          </Link>
                        </li>
                        <li className="border-t border-gray-700 my-2 w-full"></li>
                        <li>
                          <Link
                            to="/me"
                            onClick={handleMobileMenuItemClick}
                            className={`block py-4 px-8 rounded-xl w-full text-left ${
                              location.pathname === "/me" ||
                              location.pathname.startsWith("/me/")
                                ? "text-white bg-primary shadow-lg"
                                : "text-gray-700 dark:text-gray-100 hover:text-white transition-colors  rounded-xl hover:bg-gray-800"
                            }`}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/deals"
                            onClick={handleMobileMenuItemClick}
                            className={`block py-4 px-8 rounded-xl w-full text-left ${
                              location.pathname === "/deals"
                                ? "text-white bg-primary shadow-lg"
                                : "text-gray-700 dark:text-gray-100 hover:text-white transition-colors  rounded-xl hover:bg-gray-800"
                            }`}
                          >
                            Deals
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/pharmacies"
                            onClick={handleMobileMenuItemClick}
                            className={`block py-4 px-8 rounded-xl w-full text-left ${
                              location.pathname === "/pharmacies"
                                ? "text-white bg-primary shadow-lg"
                                : "text-gray-700 dark:text-gray-100 hover:text-white transition-colors  rounded-xl hover:bg-gray-800"
                            }`}
                          >
                            Pharmacies
                          </Link>
                        </li>
                        <li className="relative">
                          {/* when hover in link make svg color change to primary color */}
                          <Link
                            to="/favorites"
                            onClick={handleMobileMenuItemClick}
                            className={`block py-4 px-8 rounded-xl w-full text-left flex items-center justify-between ${
                              location.pathname === "/favorites"
                                ? "text-white bg-primary shadow-lg"
                                : "text-gray-700 dark:text-gray-100 hover:text-white group  transition-colors rounded-xl hover:bg-gray-800"
                            }`}
                          >
                            <span>Favorites</span>
                            {favorites.deals.length +
                              favorites.pharmacies.length >
                              0 && (
                              <span className="ml-2 relative">
                                <svg
                                  className="inline w-6 h-6 text-zinc-600 dark:text-white group-hover:text-white transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold min-w-[20px] h-[20px] flex items-center justify-center">
                                  {favorites.deals.length +
                                    favorites.pharmacies.length}
                                </span>
                              </span>
                            )}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings"
                            onClick={handleMobileMenuItemClick}
                            className={`block py-4 px-8 rounded-xl w-full text-left ${
                              location.pathname === "/settings"
                                ? "text-white bg-primary shadow-lg"
                                : "text-gray-700 dark:text-gray-100 hover:text-white transition-colors rounded-xl hover:bg-gray-800"
                            }`}
                          >
                            Settings
                          </Link>
                        </li>
                        <li className="border-t border-gray-700 my-2 w-full"></li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              handleMobileMenuItemClick();
                            }}
                            className="block w-full  py-4 px-8  text-gray-700 dark:text-gray-100 cursor-pointer hover:text-white transition-colors rounded-xl hover:bg-gray-800"
                          >
                            Sign out
                          </button>
                        </li>
                      </>
                    ) : (
                      // Not authenticated: show Login/Sign up as buttons at the bottom
                      <>
                        <li>
                          <Link
                            to="/"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 dark:text-gray-100 hover:text-white transition-colors  rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                            aria-current="page"
                          >
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/advertise"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/advertise"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 dark:text-gray-100 hover:text-white transition-colors rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                          >
                            Advertise
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/contact"
                            onClick={handleMobileMenuItemClick}
                            className={
                              location.pathname === "/contact"
                                ? "block py-4 px-8 text-white bg-primary rounded-xl shadow-lg w-full text-left"
                                : "block py-4 px-8 text-gray-700 dark:text-gray-100 hover:text-white transition-colors rounded-xl hover:bg-gray-800 w-full text-left"
                            }
                          >
                            Contact
                          </Link>
                        </li>
                        <li className="w-full flex flex-row gap-4 justify-center mt-8">
                          <Link
                            to="/auth/login"
                            onClick={handleMobileMenuItemClick}
                            className="px-8 py-3 rounded-lg bg-primary text-white font-semibold text-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            Login
                          </Link>
                          <Link
                            to="/auth/signup"
                            onClick={handleMobileMenuItemClick}
                            className="px-8 py-3 rounded-lg text-gray-700 dark:text-gray-100 hover:text-white transition-colors rounded-xl hover:bg-gray-800 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            Sign up
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                {/* Add a scroll indicator arrow at the bottom of the menu, only visible if the menu is scrollable */}
                <div
                  id="mobile-menu-scroll-indicator"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-300 opacity-0"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-down text-primary animate-bounce"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <div className="hidden md:flex items-center justify-between w-full md:w-auto md:order-1">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border  rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  ">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/"
                    className={
                      location.pathname === "/"
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 "
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
                    }
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className={
                      location.pathname === "/advertise"
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 "
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
                    }
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={
                      location.pathname === "/contact"
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 "
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
                    }
                  >
                    Contact
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
