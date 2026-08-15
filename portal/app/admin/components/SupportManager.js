'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SupportManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/admin/support?q=${searchTerm}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      toast.error('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Request marked as ${newStatus}`);
        fetchRequests();
        if (selectedRequest?.id === id) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch('/api/admin/support', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Request deleted');
        fetchRequests();
        if (selectedRequest?.id === id) setSelectedRequest(null);
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Support <span className="text-indigo-500">Requests</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage student inquiries and technical issues</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search student, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-400"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </header>

      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Submitted</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No requests found</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-sm text-white">{req.fullName}</p>
                        <p className="text-[11px] text-slate-500">{req.email}</p>
                        <p className="text-[10px] text-indigo-400 font-black mt-1 uppercase tracking-wider">ID: {req.internId}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-300">{req.subject}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-medium text-slate-500 uppercase">{new Date(req.createdAt).toLocaleDateString()}</p>
                      <p className="text-[9px] text-slate-600 uppercase">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button 
                          onClick={() => deleteRequest(req.id)}
                          className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-12 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white">{selectedRequest.subject}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Request ID: #{selectedRequest.id}</p>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Student Name</p>
                    <p className="text-white font-bold">{selectedRequest.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Intern ID</p>
                    <p className="text-indigo-400 font-black uppercase tracking-tight">{selectedRequest.internId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</p>
                    <p className="text-white font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Submission Date</p>
                    <p className="text-slate-400 font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Problem Description</p>
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                  <p className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Update Status</p>
                  <button 
                    onClick={() => updateStatus(selectedRequest.id, 'Pending')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRequest.status === 'Pending' ? 'bg-slate-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    Mark Pending
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedRequest.id, 'In Progress')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRequest.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedRequest.id, 'Resolved')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRequest.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
