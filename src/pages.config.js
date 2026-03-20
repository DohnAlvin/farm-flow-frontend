/**
 * pages.config.js - Page routing configuration
 * * This file connects your functional components to the application's
 * global routing and layout system.
 */

import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import Livestock from './pages/Livestock';
import Tasks from './pages/Tasks';
import Finances from './pages/Finances';
import Weather from './pages/Weather';
import __Layout from './Layout.jsx';

// 🗺️ The Map: Each key becomes a URL slug via createPageUrl
export const PAGES = {
  "Dashboard": Dashboard,
  "Fields": Fields,
  "Livestock": Livestock,
  "Tasks": Tasks,
  "Finances": Finances,
  "Weather": Weather,
};

// ⚙️ The Configuration: Tying it all together
export const pagesConfig = {
  // Change "Dashboard" to another key from PAGES to change the entry point
  mainPage: "Dashboard", 
  
  // The collection of all routes
  Pages: PAGES,
  
  // The global UI wrapper (Sidebar, Navigation, User Section)
  Layout: __Layout,
};