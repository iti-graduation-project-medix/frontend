import { useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

/**
 * Custom hook for debounced search functionality
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds (default: 500)
 * @returns {Function} - The debounced function
 */
export const useDebounce = (callback, delay = 500) => {
  const debouncedFnRef = useRef();

  // Create the debounced function only once and store it in ref
  useEffect(() => {
    debouncedFnRef.current = debounce(callback, delay);

    // Cleanup function to cancel any pending debounced calls
    return () => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel();
      }
    };
  }, [callback, delay]);

  // Return a stable function that calls the debounced function
  const debouncedCallback = useCallback((...args) => {
    if (debouncedFnRef.current) {
      return debouncedFnRef.current(...args);
    }
  }, []);

  return debouncedCallback;
};
