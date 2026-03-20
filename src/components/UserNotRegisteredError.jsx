// @ts-nocheck
import React from 'react'
import { ShieldAlert, LogOut, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"

const UserNotRegisteredError = () => {
  const handleLogout = () => {
    // This typically calls your Django/Backend logout endpoint 
    console.log("Logging out...")
    // window.location.href = "/api/auth/logout/"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4 font-sans">
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl border border-stone-200">
        <div className="text-center">
          {/* Icon Section */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-amber-50 border border-amber-100 text-amber-600">
            <ShieldAlert size={40} strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-stone-950 tracking-tight mb-4">
            Access Restricted
          </h1>
          
          <p className="text-stone-600 leading-relaxed mb-8">
            Your account is authenticated, but you are not currently registered to access the <span className="font-bold text-stone-900">Farm Management System</span>.
          </p>

          {/* Instruction Box */}
          <div className="p-6 bg-stone-50 rounded-xl border border-stone-100 text-left text-sm text-stone-600 mb-8">
            <p className="font-bold text-stone-900 mb-3 text-xs uppercase tracking-wider">Next Steps:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-700 shrink-0">1</div>
                <span>Verify you are using your official work email.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-700 shrink-0">2</div>
                <span>Contact your Administrator to whitelist your account.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button 
              className="w-full bg-[#1B4332] hover:bg-[#143326] text-white py-6 rounded-xl font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
              onClick={() => window.location.href = "mailto:admin@farm-app.com"}
            >
              <Mail className="mr-2 h-4 w-4" /> Contact Administrator
            </Button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-stone-500 hover:text-red-600 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              Sign out and try another account
            </button>
          </div>
        </div>
      </div>
      
      {/* Branding Footer */}
      <p className="mt-8 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Agritech Management Systems v2.4
      </p>
    </div>
  )
}

export default UserNotRegisteredError