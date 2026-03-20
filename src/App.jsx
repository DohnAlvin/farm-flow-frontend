// @ts-nocheck
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { pagesConfig } from './pages.config';

// UI Components & Logic
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from './lib/AuthContext';
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import PageNotFound from './lib/PageNotFound';
import { Loader2 } from "lucide-react";

// 🔑 IMPORT YOUR PUBLIC PAGES HERE
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => <></>;

/**
 * 🌿 LayoutWrapper
 * Ensures the Layout is only rendered once per route change
 * and maintains the Stone & Forest aesthetic.
 */
const LayoutWrapper = ({ children, currentPageName }) => 
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <div className="min-h-screen bg-stone-50">{children}</div>
  );

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // 🛰️ Global Loading State (Syncing with Django)
  // Replaces the automated SDK bootloader with your custom branding
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-stone-50 z-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B4332] mb-4" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 animate-pulse">
          Establishing Secure Link...
        </p>
      </div>
    );
  }

  // 🛡️ Auth Guard Logic for Traditional Django Auth
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // In a traditional app, this triggers your standard login redirect
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* 🏠 Main Entry Point */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {/* 🗺️ Dynamic Page Mapping (Standard Slug Generation) */}
      {Object.entries(Pages).map(([path, PageComponent]) => (
        <Route
          key={path}
          path={`/${path.toLowerCase().replace(/\s+/g, '-')}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <PageComponent />
            </LayoutWrapper>
          }
        />
      ))}

      {/* 🚫 Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        {/* Added the future flags here to silence the React Router v7 warnings */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* 🚪 UNPROTECTED ROUTES: Bypasses the auth guard so users can sign up and log in */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* 🚜 PROTECTED APP: Everything else runs through your existing guard */}
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;