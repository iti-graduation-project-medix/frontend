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

export default function Navbar() {
  const isOffline = useOffline();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] =
    useState(false);
  const [drugAlertNotifications, setDrugAlertNotifications] = useState([]);
  const [unreadDrugAlerts, setUnreadDrugAlerts] = useState(0);
  const { user, isAuthenticated, logout, initializeAuth, token } = useAuth();
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const { favorites, fetchFavorites } = useFav();

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

  const location = useLocation();

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

  return (
    <nav
      className=" border-gray-200 "
      style={{ paddingTop: isOffline ? "2rem" : "0" }}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse focus:outline-none"
        >
          <img
            src="/logo.svg"
            className="h-10 sm:h-10 lg:h-14 xl:h-16 transition-all duration-200"
            alt="Dawaback Logo"
          />
          <div className="flex flex-col mb-2 md:mb-3">
            <span className="font-bold text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap text-primary dark:text-white transition-all duration-200">
              Dawaback
            </span>
            <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-zinc-700 ms-.5 leading-0 mt-1 dark:text-gray-400 transition-all duration-200">
              Before it expires, trade it with desire
            </p>
          </div>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Theme Mode Toggle and Notification Bell */}
          <div className={`flex items-center gap-2 ${!isAuthenticated ? 'mr-4' : 'mr-1 md:mr-2'}`}>
            <ModeToggle />
            {isAuthenticated && (
              <Popover
                open={isNotificationPopoverOpen}
                onOpenChange={setIsNotificationPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                  >
                    <FiBell className="h-[1.2rem] w-[1.2rem] text-zinc-600 dark:text-white" />
                    {unreadDrugAlerts > 0 && (
                      <Badge className="absolute bottom-6 left-4 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[24px] h-[24px] flex items-center justify-center z-50">
                        {unreadDrugAlerts}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 bg-white dark:bg-card border border-gray-100 dark:border-border shadow-lg"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-border font-semibold text-base text-gray-900 dark:text-foreground bg-white dark:bg-card">
                    Drug Alert Notifications
                  </div>
                  {drugAlertNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-border max-h-96 overflow-y-auto bg-white dark:bg-card">
                      {drugAlertNotifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={`p-4 cursor-pointer text-sm transition-colors ${
                            !notification.isRead
                              ? "bg-blue-50 dark:bg-blue-900/30"
                              : "bg-white dark:bg-card"
                          } hover:bg-muted dark:hover:bg-muted/20`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start">
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
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-card">
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
                  <Heart className="h-[1.2rem] w-[1.2rem] text-zinc-600 dark:text-white" />
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
                  <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                    <AvatarFallback>
                      {getInitials(
                        user?.fullName ||
                          user?.name ||
                          pharmacistDetails?.fullName ||
                          "User"
                      )}
                    </AvatarFallback>
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
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="items-center justify-between w-full md:hidden md:w-auto md:order-1"
            >
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                {/* Main Navigation */}
                <li>
                  <Link
                    to="/"
                    className={
                      location.pathname === "/"
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-primary"
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-primary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
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
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-primary"
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-primary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
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
                        ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-primary"
                        : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-primary dark:hover:bg-primary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }
                  >
                    Contact
                  </Link>
                </li>

                {/* User Account Section (only for authenticated users) */}
                {isAuthenticated && (
                  <>
                    {/* Divider */}
                    <li className="border-t border-gray-200 dark:border-gray-600 my-2 md:hidden"></li>

                    {/* User Profile */}
                    <li>
                      <Link
                        to="/me"
                        onClick={handleMenuClick}
                        className={`block py-2 px-3 ${
                          location.pathname === "/me" ||
                          location.pathname.startsWith("/me/")
                            ? "text-white bg-primary rounded-sm"
                            : "text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        Profile
                      </Link>
                    </li>

                    {/* User Content */}
                    <li>
                      <Link
                        to="/deals"
                        onClick={handleMenuClick}
                        className={`block py-2 px-3 ${
                          location.pathname === "/deals"
                            ? "text-white bg-primary rounded-sm"
                            : "text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        My Deals
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/pharmacies"
                        onClick={handleMenuClick}
                        className={`block py-2 px-3 ${
                          location.pathname === "/pharmacies"
                            ? "text-white bg-primary rounded-sm"
                            : "text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        My Pharmacies
                      </Link>
                    </li>

                    {/* User Actions */}
                    <li>
                      <Link
                        to="/favorites"
                        className={
                          location.pathname === "/favorites"
                            ? "flex items-center justify-between gap-2 py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500"
                            : "flex items-center justify-between gap-2 py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        }
                      >
                        <span>Favorites</span>
                        <span className="relative">
                          <Heart
                            className={
                              location.pathname === "/favorites"
                                ? "text-white w-5 h-5"
                                : "w-5 h-5 text-zinc-600 dark:text-white"
                            }
                          />
                          {favorites.deals.length +
                            favorites.pharmacies.length >
                            0 && (
                            <Badge className="absolute bottom-3 left-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[18px] h-[18px] flex items-center justify-center">
                              {favorites.deals.length +
                                favorites.pharmacies.length}
                            </Badge>
                          )}
                        </span>
                      </Link>
                    </li>

                    {/* Settings & Logout */}
                    <li>
                      <Link
                        to="/settings"
                        onClick={handleMenuClick}
                        className={`block py-2 px-3 ${
                          location.pathname === "/settings"
                            ? "text-white bg-primary rounded-sm"
                            : "text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        Settings
                      </Link>
                    </li>

                    {/* Divider before logout */}
                    <li className="border-t border-gray-200 dark:border-gray-600 my-2 md:hidden"></li>

                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                )}

                {!isAuthenticated && (
                  <li className="mt-4">
                    <div className="flex justify-center items-center mx-auto space-x-4">
                      <MotionLink
                        to={"/auth/login"}
                        whileTap="tap"
                        whileHover="hover"
                        variants={buttonVariants}
                        className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-primary/30 font-medium rounded-lg text-sm px-4 py-2  dark:hover:bg-[var(--primary-hover)] focus:outline-none "
                      >
                        Login
                      </MotionLink>
                      <MotionLink
                        to={"/auth/signup"}
                        whileTap="tap"
                        whileHover="hover"
                        variants={buttonVariants}
                        className="text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      >
                        Sign up
                      </MotionLink>
                    </div>
                  </li>
                )}
              </ul>
            </motion.div>
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
