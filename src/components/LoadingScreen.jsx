import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    "Initializing...",
    "Loading components...",
    "Connecting to services...",
    "Preparing your experience...",
    "Almost ready...",
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 800);

    const completeTimeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 1000);
    }, 5000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [onLoadingComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const logoVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 1.5,
      },
    },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 4.5,
        ease: "easeInOut",
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white dark:bg-background text-gray-900 dark:text-foreground"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-purple-200/30 to-pink-200/30 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Logo */}
            <motion.div
              className="relative"
              variants={logoVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full blur-xl opacity-50"
                variants={pulseVariants}
                animate="animate"
              />
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <img
                  src="/logo.svg"
                  alt="DawaBack Logo"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* App Name */}
            <motion.div className="text-center" variants={textVariants}>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-primary dark:text-primary mb-2"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Dawaback
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium"
                variants={textVariants}
              >
                Before it expires, trade it with desire{" "}
              </motion.p>
            </motion.div>

            {/* Loading Steps */}
            <motion.div
              className="flex flex-col items-center space-y-4"
              variants={textVariants}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  className="text-center"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                    {loadingSteps[currentStep]}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar */}
              <div className="w-64 md:w-80 h-2 bg-gray-200 dark:bg-muted rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500 rounded-full shadow-lg"
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
                />
              </div>

              {/* Loading Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute top-10 right-10 w-8 h-8 bg-blue-400 dark:bg-blue-900 rounded-full opacity-60"
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-6 h-6 bg-indigo-400 dark:bg-indigo-900 rounded-full opacity-60"
              animate={{
                y: [0, 20, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
