// @ts-nocheck
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, AlertCircle, Construction } from 'lucide-react';
import { useAuth } from "@/lib/AuthContext";
import { Button } from "../components/ui/button";

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const pathName = location.pathname.substring(1) || "this page";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
      <div className="max-w-md w-full">
        <div className="text-center space-y-8">
          
          <div className="relative inline-block">
            <h1 className="text-9xl font-black text-stone-200/60 tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
               <AlertCircle className="w-12 h-12 text-stone-400" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              Lost in the field?
            </h2>
            <p className="text-stone-600 leading-relaxed px-4">
              We couldn't find the page <span className="font-mono text-sm bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">/{pathName}</span>. 
              It might have been moved or hasn't been planted yet.
            </p>
          </div>
          
          {isAuthenticated && user?.role === 'admin' && (
            <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 text-left animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Construction className="w-5 h-5 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-900 uppercase tracking-wider">Developer Note</p>
                  <p className="text-sm text-amber-800/80 leading-snug">
                    This route is defined but the component is missing. Ensure you've created the <strong>{pathName}</strong> view.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-[#1B4332] hover:bg-[#143326] text-white px-8 py-6 rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}