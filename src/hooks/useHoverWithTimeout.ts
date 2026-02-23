import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing hover state with timeout debouncing.
 * Prevents flicker when hovering between elements.
 */
export function useHoverWithTimeout<T>(enterDelay = 120, leaveDelay = 70) {
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(
    (value: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setHoveredValue(value), enterDelay);
    },
    [enterDelay]
  );

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHoveredValue(null), leaveDelay);
  }, [leaveDelay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    hoveredValue,
    handleMouseEnter,
    handleMouseLeave,
  };
}
