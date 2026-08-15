'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain_id: '',
    difficulty: 'Beginner',
    technologies: '',
    duration: '',
    github_requirement: false,
    learning_outcome: '',
    project_scope: '',
    image_url: '',
    instructions: ''
  });

  useEffect(() => {
    fetchDomains();
    fetchProjects();
  }, [searchTerm, filterDomain, filterDifficulty]);

  const fetchDomains = async () => {
    try {
      const res = await fetch('/api/admin/domains');
      const data = await res.json();
      if (data.success) setDomains(data.domains);
    } catch (err) {
      toast.error('Failed to load domains');
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects?q=${searchTerm}&domainId=${filterDomain}&difficulty=${filterDifficulty}`);
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        github_requirement: !!project.github_requirement,
        technologies: project.technologies || '',
        duration: project.duration || '',
        learning_outcome: project.learning_outcome || '',
        project_scope: project.project_scope || '',
        image_url: project.image_url || '',
        instructions: project.instructions || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        domain_id: domains[0]?.id || '',
        difficulty: 'Beginner',
        technologies: '',
        duration: '',
        github_requirement: false,
        learning_outcome: '',
        project_scope: '',
        image_url: '',
        instructions: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProject ? 'PATCH' : 'POST';
    const payload = editingProject ? { ...formData, id: editingProject.id } : formData;

    try {
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        fetchProjects();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project permanently?')) return;
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Project removed');
        fetchProjects();
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic mb-2">Project <span className="text-indigo-500">Management</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Configure real-time internship tasks</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Project
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            type="text" 
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <select 
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
        >
          <option value="">All Domains</option>
          {domains.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select 
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </section>

      {/* Table */}
      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Name</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Domain</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Difficulty</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Created</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Projects...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No projects found</td></tr>
            ) : projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{p.name}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 max-w-md">{p.description}</p>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">{p.domainName}</span>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                     p.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                     p.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' :
                     'bg-red-500/10 text-red-500'
                   }`}>{p.difficulty}</span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleOpenModal(p)}
                      className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <header className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase italic">{editingProject ? 'Edit' : 'Add'} <span className="text-indigo-500">Project</span></h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Configure all project parameters</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-slate-500">close</span>
                </button>
              </header>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Project Title</label>
                      <input 
                        required type="text" value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="e.g. Netflix Clone"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Domain / Course</label>
                      <select 
                        required value={formData.domain_id}
                        onChange={(e) => setFormData({...formData, domain_id: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
                      >
                        {domains.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Difficulty Level</label>
                      <select 
                        required value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Technologies (Comma separated)</label>
                      <input 
                        type="text" value={formData.technologies}
                        onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="React, Node.js, Tailwind..."
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Duration (optional)</label>
                      <input 
                        type="text" value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="e.g. 4 Weeks"
                      />
                    </div>
                    <div className="pt-4 flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-white">GitHub Required</p>
                        <p className="text-[9px] text-slate-500 uppercase mt-1">Students must submit a repo link</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, github_requirement: !formData.github_requirement})}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData.github_requirement ? 'bg-indigo-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.github_requirement ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Short Description</label>
                    <textarea 
                      required value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Learning Outcomes</label>
                      <textarea 
                        value={formData.learning_outcome}
                        onChange={(e) => setFormData({...formData, learning_outcome: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px]"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Project Scope</label>
                      <textarea 
                        value={formData.project_scope}
                        onChange={(e) => setFormData({...formData, project_scope: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px]"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Step-by-Step Instructions</label>
                    <textarea 
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all min-h-[150px]"
                      placeholder="Step 1: Setup... \nStep 2: Build..."
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Project Image URL (optional)</label>
                    <input 
                      type="text" value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                </div>
                
                <footer className="pt-4 border-t border-white/5 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-indigo-600/20"
                  >
                    {editingProject ? 'Update System' : 'Deploy Project'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 bg-white/5 text-slate-400 font-black py-5 rounded-2xl hover:bg-white/10 transition-all uppercase text-[12px] tracking-[0.2em]"
                  >
                    Cancel
                  </button>
                </footer>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
