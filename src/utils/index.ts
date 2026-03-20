import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines tailwind classes and merges conflicts.
 * Essential for building reusable UI components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a URL-safe slug from a page name.
 * Example: "Fields & Plots" -> "/fields-plots"
 */
export function createPageUrl(pageName) {
  if (!pageName) return "/";
  
  const slug = pageName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-")  // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, "");  // Remove leading/trailing hyphens

  return `/${slug}`;
}

/**
 * Formats numbers into KES currency for the ledger.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}