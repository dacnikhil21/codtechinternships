'use client';
import '@/app/globals.css';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedLogo from '@/app/components/AnimatedLogo';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(emailParam || '');
  const [resetSent, setResetSent] = useState(false);
  const [simulatedLink, setSimulatedLink] = useState('');

  // Token Verification state
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(Boolean(tokenParam));
  const [tokenError, setTokenError] = useState('');

  // Password reset fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Automatically verify reset link token when URL has ?token=...
  useEffect(() => {
    if (tokenParam) {
      const verifyToken = async () => {
        setVerifyingToken(true);
        try {
          const res = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tokenParam, email: emailParam })
          });
          const data = await res.json();

          if (data.success) {
            setIsTokenValid(true);
            if (data.email) setEmail(data.email);
            toast.success('Reset link verified. You may now enter a new password.');
          } else {
            setIsTokenValid(false);
            setTokenError(data.message || 'Invalid or expired reset link.');
            toast.error(data.message || 'Invalid or expired reset link.');
          }
        } catch (err) {
          setIsTokenValid(false);
          setTokenError('Error validating reset link.');
        } finally {
          setVerifyingToken(false);
        }
      };
      verifyToken();
    }
  }, [tokenParam, emailParam]);

  // Request Reset Link (Form Submit)
  const handleRequestResetLink = async (e) => {
    e.preventDefault();

    const cleanEmail = email.toLowerCase().trim();
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
        setResetSent(true);
        setSimulatedLink(data.resetLink || '');
        toast.success(data.message || 'Reset link sent to your email!');
      } else {
        toast.error(data.message || 'No registered account found with this exact email.');
      }
    } catch (err) {
      toast.error('Error processing password reset request.');
    } finally {
      setLoading(false);
    }
  };

  // Submit New Password (When token is valid)
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
          token: tokenParam,
          email: email.toLowerCase().trim(),
          newPassword: newPassword.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error('Error updating password.');
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
              Reset Your <br /> 
              <span className="text-indigo-200/60 italic">Password.</span>
            </h1>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <p className="text-[11px] text-white/60 font-black uppercase tracking-[0.2em]">CODTECH Security Portal</p>
          </div>
        </section>

        {/* Right Side Content */}
        <section className="col-span-1 lg:col-span-6 p-8 md:p-12 bg-transparent flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex lg:hidden pt-8 mb-12 flex-col items-center w-full">
              <div className="scale-[0.8] md:scale-100 flex justify-center origin-center">
                <AnimatedLogo />
              </div>
            </div>

            {/* Mode 1: Verifying Token from Link */}
            {verifyingToken ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-bold text-sm uppercase tracking-wider">Verifying Password Reset Link...</p>
              </div>
            ) : tokenParam ? (
              /* Mode 2: Token Present -> Set New Password */
              isTokenValid ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-1 tracking-tight uppercase">New Password</h2>
                    <p className="text-slate-400 font-medium text-xs">Set a new password for <strong className="text-indigo-400">{email}</strong></p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-6">
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
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                  <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
                  <h3 className="text-lg font-bold text-white mb-2">Reset Link Expired or Invalid</h3>
                  <p className="text-xs text-slate-300 mb-6">{tokenError}</p>
                  <button 
                    onClick={() => router.push('/forgot-password')} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-all"
                  >
                    Request New Reset Link
                  </button>
                </div>
              )
            ) : resetSent ? (
              /* Mode 3: Reset Link Sent Screen */
              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Reset Link Sent!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We have sent a secure password reset link to <strong>{email}</strong>. Please check your email inbox and click the link to reset your password.
                </p>

                {simulatedLink && (
                  <div className="mt-4 p-4 bg-slate-950/80 rounded-xl border border-white/10 text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Direct Reset Link:</p>
                    <a 
                      href={simulatedLink} 
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-mono break-all underline block"
                    >
                      {simulatedLink}
                    </a>
                  </div>
                )}

                <div className="pt-4">
                  <Link href="/login" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              /* Mode 4: Initial Request Form (Enter Registered Email) */
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-white mb-1 tracking-tight uppercase">Forgot Password</h2>
                  <p className="text-slate-400 font-medium text-xs">Enter your registered email address to receive a password reset link.</p>
                </div>

                <form onSubmit={handleRequestResetLink} className="space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="email">Registered Email Address</label>
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

                  <button disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-white/10" type="submit">
                    {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                    {!loading && <span className="material-symbols-outlined text-lg">send</span>}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <Link href="/login" className="text-slate-400 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Login
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
