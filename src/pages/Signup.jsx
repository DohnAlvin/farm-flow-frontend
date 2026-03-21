import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import axios from 'axios'; // 🌟 ADDED AXIOS IMPORT

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    // 1. Basic frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      // 🌟 FIX: Using explicit axios call with the full Render URL
      await axios.post('https://farmflow-api-s521.onrender.com/api/auth/registration/', {
        email: email,
        password1: password,
        password2: confirmPassword
      });

      // 3. Success! 
      setSuccessMsg("Account created successfully! Redirecting to login...");
      
      // Give them a second to read the success message, then send to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Signup Error:", err);
      // Safely grab the error message from Axios
      const errorMessage = err.response?.data?.email?.[0] 
        || err.response?.data?.detail 
        || 'Failed to create account. This email may already exist.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#143023] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#1B4332] rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#2D6A4F] rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>

      {/* Main Signup Card */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 border border-white/20">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#E9F5E9] to-[#C8E6C9] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-green-100">
            <Sprout className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Join FarmFlow</h1>
          <p className="text-[#2D6A4F] font-semibold tracking-wide mt-1">Create your account</p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center transition-all">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-bold text-center transition-all">
            {successMsg}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all font-medium"
                placeholder="farmer@farmflow.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!successMsg}
            className="w-full mt-6 bg-[#1B4332] hover:bg-[#143023] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1B4332]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer Link back to Login */}
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500 font-medium">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#2D6A4F] font-bold hover:underline">
              Sign in here
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
}