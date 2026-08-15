'use client';
import '../globals.css';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedLogo from '@/app/components/AnimatedLogo';

const TYPO_DOMAINS = [
  'gm6ail.com', 'gmaiil.com', 'gmal.com', 'yaho.co', 'yahu.com', 'outlook.con',
  'gmil.com', 'gmale.com', 'gnail.com', 'gmaill.com', 'gmaik.com', 'gmai.com'
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot Password 3-Step state
  // Step 1: Email entry | Step 2: OTP Verification Code | Step 3: Set New Password
  const [forgotStep, setForgotStep] = useState(1); 
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'session_expired') {
      toast.error('Session expired. Please login again.', { id: 'session-expired', duration: 5000 });
      router.replace('/login');
    }
  }, [searchParams, router]);

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailLower)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const domain = emailLower.split('@')[1];
    if (TYPO_DOMAINS.includes(domain)) {
      toast.error(`"${domain}" looks like a typo. Please check.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        setLoginError(data.message || 'Incorrect password');
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify exact registered email & send 6-digit verification code
  const handleSendVerificationEmail = async (e) => {
    e.preventDefault();

    const cleanEmail = forgotEmail.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();

      if (data.success) {
        setUserName(data.name || 'Intern');
        toast.success(data.message || `Verification code sent to ${cleanEmail}`);
        if (data.code) {
          toast(`[DEV DEMO CODE]: ${data.code}`, { icon: '🔑', duration: 10000 });
        }
        setForgotStep(2);
      } else {
        toast.error(data.message || 'No registered account found with this exact email.');
      }
    } catch (err) {
      toast.error('Error sending verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code sent to your email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.toLowerCase().trim(),
          code: otpCode.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Verification code confirmed!');
        setForgotStep(3);
      } else {
        toast.error(data.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      toast.error('Error verifying code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.trim().length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.toLowerCase().trim(),
          otpCode: otpCode.trim(),
          newPassword: newPassword.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Password updated successfully! Returning to login...');
        setTimeout(() => {
          setMode('login');
          setForgotStep(1);
          setOtpCode('');
          setPassword('');
          setLoginError('');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 relative overflow-x-hidden w-full max-w-full">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="w-full max-w-[400px] lg:max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Left Side Banner */}
        <section className="hidden lg:flex lg:col-span-6 p-12 flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-800 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-12 flex justify-center w-full">
              <AnimatedLogo />
            </div>
            <h1 className="text-4xl font-black text-white mb-6 tracking-tighter leading-tight uppercase">
              Fuel Your <br /> 
              <span className="text-indigo-200/60 italic">Career.</span>
            </h1>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="flex -space-x-4">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-indigo-400 shadow-xl" />)}
             </div>
             <p className="text-[11px] text-white/60 font-black uppercase tracking-[0.2em]">Join 10k+ Elite Interns</p>
          </div>
        </section>

        {/* Right Side Form (Login vs Forgot Password) */}
        <section className="col-span-1 lg:col-span-6 p-8 md:p-12 bg-transparent flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex lg:hidden pt-8 mb-12 flex-col items-center w-full">
              <div className="scale-[0.8] md:scale-100 flex justify-center origin-center">
                <AnimatedLogo />
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <button 
                type="button" 
                onClick={() => { setMode('login'); setForgotStep(1); }} 
                className={`text-xl font-black uppercase tracking-tight transition-all ${mode === 'login' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotStep(1); }} 
                className={`text-xl font-black uppercase tracking-tight transition-all ${mode === 'forgot' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Forgot Password
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                /* LOGIN FORM */
                <motion.div key="login-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  {loginError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col gap-2 text-red-300">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">warning</span> Incorrect Password
                      </div>
                      <p className="text-xs text-slate-300">Forgot your password? Verify your email to get a reset code.</p>
                      <button 
                        type="button" 
                        onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotStep(1); }}
                        className="mt-1 text-left text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">mark_email_read</span> Send Verification Code &rarr;
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="email">Identity</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">mail</span>
                        <input 
                          className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" 
                          id="email" 
                          required 
                          placeholder="intern@codtech.edu" 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center justify-between ml-1 mb-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" htmlFor="password">Security</label>
                        <button 
                          type="button" 
                          onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotStep(1); }} 
                          className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.15em]"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">lock</span>
                        <input 
                          className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" 
                          id="password" 
                          required 
                          placeholder="••••••••" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <button disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-white/10" type="submit">
                      {loading ? 'Authenticating...' : 'Establish Connection'}
                      {!loading && <span className="material-symbols-outlined text-lg">arrow_right_alt</span>}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotStep(1); }}
                      className="text-indigo-400 hover:text-indigo-300 font-black uppercase text-[11px] tracking-[0.25em] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">lock_reset</span> Forgot Password?
                    </button>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">New to the platform?</p>
                    <Link href="/register" className="text-white hover:text-indigo-400 transition-all font-black uppercase text-[11px] tracking-[0.3em]">
                      Create Elite Account
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* 3-STEP EMAIL VERIFICATION FORGOT PASSWORD FORM */
                <motion.div key="forgot-form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  
                  {/* Step Progress Indicators */}
                  <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className={`px-2 py-1 rounded ${forgotStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1. Email</span>
                    <span>&rarr;</span>
                    <span className={`px-2 py-1 rounded ${forgotStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2. Verification Code</span>
                    <span>&rarr;</span>
                    <span className={`px-2 py-1 rounded ${forgotStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>3. Reset</span>
                  </div>

                  {forgotStep === 1 && (
                    /* STEP 1: Enter Registered Email */
                    <form onSubmit={handleSendVerificationEmail} className="space-y-6">
                      <div className="mb-2">
                        <p className="text-xs text-slate-300 font-medium">Enter your registered email address. We will verify your account and send a 6-digit verification code to your email.</p>
                      </div>

                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="forgotEmail">Registered Email Address</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">mail</span>
                          <input 
                            className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" 
                            id="forgotEmail" 
                            required 
                            placeholder="intern@codtech.edu" 
                            type="email" 
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <button disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-white/10" type="submit">
                        {loading ? 'Sending Code...' : 'Send Verification Code'}
                        {!loading && <span className="material-symbols-outlined text-lg">send</span>}
                      </button>
                    </form>
                  )}

                  {forgotStep === 2 && (
                    /* STEP 2: Enter 6-Digit Verification Code */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                        A 6-digit verification code has been sent to <strong>{forgotEmail}</strong>. Please check your email inbox and enter the code below.
                      </div>

                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="otpCode">6-Digit Verification Code</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">pin</span>
                          <input 
                            className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-bold text-center tracking-[0.4em] text-lg" 
                            id="otpCode" 
                            required 
                            maxLength={6}
                            placeholder="123456" 
                            type="text" 
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                          />
                        </div>
                      </div>

                      <button disabled={loading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-500 transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-600/30" type="submit">
                        {loading ? 'Verifying Code...' : 'Verify Code & Proceed'}
                        {!loading && <span className="material-symbols-outlined text-lg">verified</span>}
                      </button>

                      <div className="text-center">
                        <button type="button" onClick={() => setForgotStep(1)} className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wider font-bold">
                          Resend Code / Change Email
                        </button>
                      </div>
                    </form>
                  )}

                  {forgotStep === 3 && (
                    /* STEP 3: Enter New Password */
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                        Identity verified for <strong>{userName}</strong>. You may now enter your new password.
                      </div>

                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="newPassword">New Password</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">lock</span>
                          <input 
                            className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" 
                            id="newPassword" 
                            required 
                            placeholder="At least 6 characters" 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">lock_reset</span>
                          <input 
                            className="w-full pl-12 pr-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-600 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" 
                            id="confirmPassword" 
                            required 
                            placeholder="Repeat new password" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-500/25" type="submit">
                        {loading ? 'Updating Password...' : 'Update Password'}
                        {!loading && <span className="material-symbols-outlined text-lg">check_circle</span>}
                      </button>
                    </form>
                  )}

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <button 
                      type="button" 
                      onClick={() => { setMode('login'); setForgotStep(1); }} 
                      className="text-slate-400 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Login
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest">Initialising Connection...</div>}>
      <LoginContent />
    </Suspense>
  );
}
