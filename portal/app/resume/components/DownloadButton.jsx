import React, { useState } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DownloadButton({ formData, selectedTemplateId }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    if (!selectedTemplateId) {
      toast.error('Please select a template first');
      return;
    }

    const element = document.getElementById('resume-preview-content');
    if (!element) {
      toast.error('Preview element not found');
      return;
    }

    if (typeof window.html2pdf === 'undefined') {
      toast.error('PDF library not loaded yet. Please wait a moment.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating your premium resume...');

    const opt = {
      margin: 10,
      filename: `${formData.name || 'Resume'}_CodTech.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
      toast.dismiss(toastId);
      toast.success('Resume downloaded successfully!');
      setIsGenerating(false);
    }).catch(err => {
      console.error(err);
      toast.dismiss(toastId);
      toast.error('Failed to generate PDF');
      setIsGenerating(false);
    });
  };

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="lazyOnload"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={isGenerating || !selectedTemplateId}
        className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
          isGenerating || !selectedTemplateId 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20 hover:shadow-primary/30'
        }`}
      >
        <span className={`material-symbols-outlined text-lg ${isGenerating ? 'animate-spin' : ''}`}>
          {isGenerating ? 'sync' : 'download'}
        </span>
        {isGenerating ? 'Generating PDF...' : 'Download Premium Resume'}
      </motion.button>
    </>
  );
}
