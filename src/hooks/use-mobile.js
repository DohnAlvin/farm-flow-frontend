import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // In a pure React SPA, 'window' is always available on load.
  // We can initialize it with the exact value immediately to avoid UI flickering.
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Use the matchMedia event directly for better performance
    const onChange = (event) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener("change", onChange);
    
    // Cleanup the event listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}