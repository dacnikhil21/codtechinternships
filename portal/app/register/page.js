'use client';
import '../globals.css';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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

// Inner component that uses search params
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
    <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] shadow-2xl bg-white border border-slate-200">
      {/* Left Side: Branding */}
      <section className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-16 bg-blue-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Codtech Intern</span>
          </div>
          <h3 className="text-4xl font-bold text-white leading-tight mb-6">Launch Your Career Trajectory.</h3>
          <p className="text-blue-100 leading-relaxed opacity-90">Join top companies and build real-world projects that stand out on your resume.</p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-blue-700 text-xl shadow-lg">S</div>
            <div>
              <p className="font-bold text-white">Sarah Jenkins</p>
              <p className="text-xs text-blue-200">Hired at TechGlobal</p>
            </div>
          </div>
          <p className="text-sm text-white italic">"The preparation guide and targeted tasks helped me land my dream role within 3 weeks of completion."</p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-center p-8 md:p-16 bg-white">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Create your account</h2>
          <p className="text-slate-500">Join Codtech Intern to unlock your internship portal.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 px-1" htmlFor="fullName">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">person</span>
                <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="fullName" required placeholder="Alexander Pierce" type="text"/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 px-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">mail</span>
                <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="email" required placeholder="alex@example.com" type="email"/>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 px-1" htmlFor="course">Internship Domain</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">school</span>
              <select 
                id="course" 
                required 
                className="w-full pl-12 pr-12 py-4 rounded-2xl appearance-none outline-none text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="" disabled>Select your track...</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 px-1" htmlFor="password">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">lock</span>
                <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="password" required placeholder="••••••••" type="password" minLength="6"/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 px-1" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">lock_reset</span>
                <input className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-slate-900 placeholder:text-slate-300 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300" id="confirmPassword" required placeholder="••••••••" type="password" minLength="6"/>
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 mt-6" type="submit">
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-700 hover:underline font-bold">Sign in here</Link>
        </p>
      </section>
    </main>
  );
}

// Main page component with Suspense boundary
export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 gradient-bg">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      <Suspense fallback={<div className="text-white font-bold">Loading Registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
