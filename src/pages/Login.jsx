import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Sprout, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// --- GOOGLE SIGN IN BUTTON COMPONENT ---
const GoogleSignInButton = ({ setError }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError('');
      
      try {
        // ✅ FULL URL USED HERE - Perfect for Vercel
        const res = await axios.post('https://farmflow-api-s521.onrender.com/api/auth/google/', {
          access_token: tokenResponse.access_token,
        });

        // Safely grab the JWTs
        const data = res.data;
        const accessToken = data.access || data.access_token;
        const refreshToken = data.refresh || data.refresh_token;

        // Save the JWT tokens returned by Django
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Success! Force a clean reload to the dashboard
        window.location.href = '/';

      } catch (err) {
        console.error("Django Google Auth Error:", err);
        setError('Failed to authenticate with the server. Please try again.');
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.log("Google Popup Error:", error);
      setError('Google login was canceled or failed.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isGoogleLoading}
      className="w-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isGoogleLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </>
      )}
    </button>
  );
};

// --- MAIN LOGIN COMPONENT ---
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🚨 This login function is where your standard email/password API call actually happens!
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false); 
    }
  };

  return (
    <GoogleOAuthProvider clientId="597004883813-sqvjed0oi970vv1ikjidq29pqcp3j6np.apps.googleusercontent.com">
      <div className="min-h-screen bg-[#143023] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#1B4332] rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#2D6A4F] rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>

        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 border border-white/20">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E9F5E9] to-[#C8E6C9] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-green-100">
              <Sprout className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">FarmFlow</h1>
            <p className="text-[#2D6A4F] font-semibold tracking-wide mt-1">Smart Agriculture</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center transition-all">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all font-medium"
                  placeholder="manager@farmflow.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-stone-700">Password</label>
                <a href="#" className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-[#1B4332] hover:bg-[#143023] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1B4332]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-400 font-bold">OR</span>
            </div>
          </div>

          <GoogleSignInButton setError={setError} />

          {/* 🌟 THE NEW SIGNUP LINK IS RIGHT HERE */}
          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500 font-medium">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/signup')} 
                className="text-[#2D6A4F] font-bold hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}