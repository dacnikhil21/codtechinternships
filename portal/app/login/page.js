'use client';
import '../globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 gradient-bg">
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] shadow-2xl bg-white border border-slate-200">
        <section className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-16 bg-blue-700 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700 text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
              </div>
              <span className="text-white font-bold tracking-tight text-xl uppercase">Codtech Intern</span>
            </div>
            <h1 className="text-[48px] font-bold text-white mb-8 leading-[1.1]">Welcome Back.</h1>
            <p className="text-lg text-blue-100 max-w-md leading-relaxed opacity-90">
              Pick up exactly where you left off. Your career trajectory is waiting.
            </p>
          </div>
        </section>

        <section className="col-span-1 lg:col-span-6 flex flex-col justify-center p-8 md:p-20 bg-white">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Sign In</h2>
            <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-slate-700 px-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">mail</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="email" required placeholder="student@example.com" type="email"/>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-slate-700 px-1" htmlFor="password">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">lock</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="password" required placeholder="••••••••" type="password"/>
                </div>
              </div>
            </div>
            
            <button disabled={loading} className="w-full bg-blue-700 text-white font-bold py-5 rounded-2xl hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 mt-4" type="submit">
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <span className="material-symbols-outlined text-xl">login</span>}
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">Don't have an account yet?</p>
            <Link href="/register" className="text-blue-700 border-2 border-blue-700 px-10 py-3 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 font-bold">
              Create Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
