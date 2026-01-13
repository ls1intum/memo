import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing hover state with timeout debouncing.
 * Prevents flicker when hovering between elements.
 *
 * @param enterDelay - Delay in ms before setting hover state on enter (default: 120ms)
 * @param leaveDelay - Delay in ms before clearing hover state on leave (default: 70ms)
 */
export function useHoverWithTimeout<T>(enterDelay = 120, leaveDelay = 70) {
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup on unmount
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
