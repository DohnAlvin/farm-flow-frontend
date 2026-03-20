// @ts-nocheck
const isNode = typeof window === 'undefined';

// Mock storage for SSR environments to prevent "window is not defined" errors
const storage = isNode 
  ? { getItem: () => null, setItem: () => null, removeItem: () => null } 
  : window.localStorage;

const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) return defaultValue;

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  // 1. Process URL removal if requested (cleans up the address bar)
  if (removeFromUrl && searchParam) {
    urlParams.delete(paramName);
    const queryString = urlParams.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  // 2. Logic Priority: URL > LocalStorage > Default Value
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  const storedValue = storage.getItem(storageKey);
  if (storedValue) return storedValue;

  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  return null;
}

/**
 * Evaluates current application parameters.
 * We wrap this in a function to allow re-evaluation if the URL changes.
 */
export const getAppParams = () => {
  if (isNode) return {};

  // Handle Token Clearing
  if (getAppParamValue("clear_access_token") === 'true') {
    storage.removeItem('base44_access_token');
    storage.removeItem('base44_token'); 
    // Clear the flag so it doesn't keep clearing on every refresh
    const url = new URL(window.location.href);
    url.searchParams.delete("clear_access_token");
    window.history.replaceState({}, document.title, url.toString());
  }

  return {
    appId: getAppParamValue("appId", { defaultValue: import.meta.env?.VITE_BASE44_APP_ID }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
    functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env?.VITE_BASE44_FUNCTIONS_VERSION }),
    appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env?.VITE_BASE44_APP_BASE_URL }),
  }
}

// Export the initial state for immediate use
export const appParams = getAppParams();