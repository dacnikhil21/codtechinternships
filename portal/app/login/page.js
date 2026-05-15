'use client';
import '../globals.css';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TYPO_DOMAINS = [
  'gm6ail.com', 'gmaiil.com', 'gmal.com', 'yaho.co', 'yahu.com', 'outlook.con',
  'gmil.com', 'gmale.com', 'gnail.com', 'gmaill.com', 'gmaik.com', 'gmai.com'
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'session_expired') {
      toast.error('Session expired. Please login again.', {
        id: 'session-expired',
        duration: 5000,
      });
      // Clean up URL
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />
         <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-[400px] lg:max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden">
        <section className="hidden lg:flex lg:col-span-6 p-12 flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-800 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-indigo-600 text-xl font-black">terminal</span>
              </div>
              <span className="text-white font-black tracking-tight text-lg uppercase italic">CODTECH INTERN</span>
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

        <section className="col-span-1 lg:col-span-6 p-8 md:p-12 bg-transparent flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-xl font-black">terminal</span>
              </div>
              <span className="text-white font-black tracking-widest text-lg uppercase italic">CODTECH INTERN</span>
            </div>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight uppercase">Login</h2>
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.3em]">Credentials Required</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
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
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 block" htmlFor="password">Security</label>
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
              </div>
              
              <button disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-white/10" type="submit">
                {loading ? 'Authenticating...' : 'Establish Connection'}
                {!loading && <span className="material-symbols-outlined text-lg">arrow_right_alt</span>}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">New to the platform?</p>
              <Link href="/register" className="text-white hover:text-indigo-400 transition-all font-black uppercase text-[11px] tracking-[0.3em]">
                Create Elite Account
              </Link>
            </div>
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
