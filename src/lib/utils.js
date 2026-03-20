import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes safely. 
 * Prevents "class-warfare" (e.g., if you pass 'px-2' and 'px-4', 
 * twMerge ensures only the last one wins).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Detects if the application is running inside an iframe.
 * Useful for hiding Sidebars or Navbars when the app is 
 * embedded in a larger portal.
 */
export const isIframe = typeof window !== "undefined" && window.self !== window.top;

/**
 * Helper to format currency for farm transactions or costs.
 * Added a fallback to handle null/undefined values from Django API.
 */
export const formatCurrency = (value) => {
  const amount = typeof value === 'number' ? value : parseFloat(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Traditional Date Formatter
 * Useful for displaying Django's ISO date strings in a human-readable format.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};