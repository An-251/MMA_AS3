/*
 * PURPOSE: Debounce a rapidly-changing value (e.g. search input).
 * Delays updating the returned value until the user stops typing
 * for `delay` ms — prevents firing an API call on every keystroke.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(query, 500);
 */

import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
