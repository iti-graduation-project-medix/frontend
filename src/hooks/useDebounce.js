import { useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

/**
 * Custom hook for debounced search functionality
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds (default: 300)
 * @returns {Function} - The debounced function
 */
export const useDebounce = (callback, delay = 500) => {
  const debouncedFnRef = useRef();

  const debouncedCallback = useCallback(
    (...args) => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel();
      }
      
      debouncedFnRef.current = debounce(callback, delay);
      return debouncedFnRef.current(...args);
    },
    [callback, delay]
  );

  return debouncedCallback;
}; 