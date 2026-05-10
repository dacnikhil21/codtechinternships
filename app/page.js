'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            </div>
            <span className="text-primary font-bold tracking-tight text-2xl">CareerPrep Pro</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login" className="text-primary font-bold px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors">Sign In</Link>
            <Link href="/register" className="bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary-container hover:shadow-lg transition-all">Enroll Now</Link>
          </nav>
        </header>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-on-surface mb-4 tracking-tight">Available Internship Tracks</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">Select a specialized track to jumpstart your career. Gain real-world experience and connect with industry leaders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Full Stack Software Engineering",
              icon: "terminal",
              color: "bg-primary-container/10 text-primary",
              desc: "Master the modern web stack. From responsive frontend design using React/Next.js to robust backend APIs and database architecture.",
              points: ["12-week intensive program", "Real-world portfolio projects", "Technical interview prep"]
            },
            {
              title: "UX/UI Design & Product Strategy",
              icon: "design_services",
              color: "bg-tertiary-container/10 text-tertiary-container",
              desc: "Learn to build beautiful, user-centric interfaces. Master Figma, wireframing, user research, and product strategy.",
              points: ["Figma & Prototyping", "User Testing & Research", "Design Systems"]
            },
            {
              title: "Data Science & Machine Learning",
              icon: "analytics",
              color: "bg-error-container/50 text-error",
              desc: "Dive deep into data manipulation, visualization, and predictive modeling using Python, Pandas, and TensorFlow.",
              points: ["Python & SQL Mastery", "Predictive Modeling", "AI & NLP Basics"]
            },
            {
              title: "Business Development & Sales",
              icon: "trending_up",
              color: "bg-secondary-container/50 text-secondary",
              desc: "Learn the art of closing. Master enterprise sales strategies, B2B lead generation, and client relationship management.",
              points: ["B2B Sales Tactics", "CRM Management", "Negotiation Skills"]
            }
          ].map((course, idx) => (
            <div key={idx} className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/30 card-hover flex flex-col justify-between">
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${course.color.split(' ')[0]}`}>
                  <span className={`material-symbols-outlined text-4xl ${course.color.split(' ')[1]}`}>{course.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-3">{course.title}</h2>
                <p className="text-on-surface-variant mb-6 leading-relaxed">{course.desc}</p>
                <ul className="space-y-2 mb-8">
                  {course.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                      <span className="material-symbols-outlined text-tertiary-container text-lg">check_circle</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/register?course=${encodeURIComponent(course.title)}`} className="block text-center w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-container transition-colors">Select Track</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
