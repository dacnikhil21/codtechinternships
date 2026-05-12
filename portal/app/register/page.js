'use client';
import '../globals.css';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DOMAINS = [
  "React.js Web Development Intern", "Mern Stack Web Development Intern", ".Net Web Development Intern",
  "Figma Web Development Intern", "Figma App Development Intern", "Full Stack Web Development Intern",
  "Frontend Web Development Intern", "Backend Web Development Intern", "C,C++ programming Intern",
  "Software Development Intern", "Embedded Systems Intern", "Digital Marketing Intern",
  "App Development Intern", "Java Programming Intern", "Python Programming Intern",
  "Data Analytics Intern", "SQL Intern", "Devops Intern", "Power BI Intern",
  "Cloud Computing Intern", "Block Chain Technology Intern", "Software Testing Intern",
  "Automation Testing Intern", "Bigdata Intern", "Dot.Net Intern", "Data Science Intern",
  "Ul/UX Intern", "Machine Learning", "Artificial Intelligence", "Internet Of things",
  "VLSI", "Cybersecurity & Ethical Hacking"
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const course = searchParams.get('course');
    if (course) setSelectedCourse(course);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!selectedCourse) {
      toast.error('Please select an internship domain');
      return;
    }

    setLoading(true);
    const payload = {
      name: e.target.fullName.value,
      email: e.target.email.value,
      password,
      course: selectedCourse
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden">
      
      {/* Left Side: Impact */}
      <section className="hidden lg:flex lg:col-span-5 p-16 flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-xl font-black">terminal</span>
            </div>
            <span className="text-white font-black tracking-tight text-lg uppercase italic">Codtech</span>
          </div>
          <h3 className="text-5xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase italic">Start Your <br /> Mission.</h3>
          <p className="text-indigo-100/70 font-medium leading-relaxed max-w-xs">Access elite projects and industry-standard learning materials.</p>
        </div>
        
        <div className="relative z-10 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-full bg-indigo-400 border-2 border-indigo-200" />
             <div>
                <p className="font-black text-white text-sm uppercase">Sarah J.</p>
                <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Hired at Google</p>
             </div>
          </div>
          <p className="text-xs text-white/80 font-medium leading-relaxed italic">"The curriculum was intense and exactly what I needed to bridge the gap between college and industry."</p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-center p-10 md:p-16 bg-transparent">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-10">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase leading-tight">Create Elite Account</h2>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Initialize Connection</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block ml-1" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">person</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white placeholder:text-slate-700 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" id="fullName" required placeholder="Alexander Pierce" type="text" name="fullName"/>
                </div>
              </div>
              <div className="group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block ml-1" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">mail</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white placeholder:text-slate-700 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" id="email" required placeholder="alex@codtech.edu" type="email" name="email"/>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block ml-1" htmlFor="course">Domain</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">school</span>
                <select 
                  id="course" 
                  required 
                  className="w-full pl-12 pr-12 py-4 rounded-2xl appearance-none outline-none text-white bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  name="course"
                >
                  <option value="" disabled className="bg-slate-900">Select your track...</option>
                  {DOMAINS.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block ml-1" htmlFor="password">Security</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-lg">lock</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white placeholder:text-slate-700 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" id="password" required placeholder="••••••••" type="password" minLength="6" name="password"/>
                </div>
              </div>
              <div className="group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block ml-1" htmlFor="confirmPassword">Verify</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors text-lg">lock_reset</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white placeholder:text-slate-700 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 font-medium text-sm" id="confirmPassword" required placeholder="••••••••" type="password" minLength="6" name="confirmPassword"/>
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-white/10" type="submit">
              {loading ? 'Initializing...' : 'Access Portal'}
            </button>
          </form>

          <p className="text-center mt-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Already an Intern? <Link href="/login" className="text-white hover:text-indigo-400 font-black transition-all">Sign in</Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements shared with Login */}
      <div className="absolute top-0 left-0 w-full h-full">
         <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />
         <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <Suspense fallback={<div className="text-white font-bold uppercase tracking-widest relative z-10">Initializing...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
