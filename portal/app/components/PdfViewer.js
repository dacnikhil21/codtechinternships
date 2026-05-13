'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function PdfViewer({ pdf, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/api/materials/file?file=${encodeURIComponent(pdf.filename)}`;
    link.download = pdf.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 lg:p-6 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200/20 ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-full h-full lg:max-w-6xl lg:h-[90vh] lg:rounded-2xl'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 bg-white border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <span className="material-symbols-outlined text-lg md:text-xl">picture_as_pdf</span>
              </div>
              <div className="max-w-[150px] md:max-w-none">
                <h3 className="font-bold text-slate-900 text-[11px] md:text-sm tracking-tight truncate">{pdf.name}</h3>
                <p className="text-[9px] md:text-[11px] text-slate-400 font-medium">Premium Material</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors tooltip-trigger"
                title="Download PDF"
              >
                <span className="material-symbols-outlined text-sm font-bold">download</span>
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors hidden lg:flex"
                title="Toggle Fullscreen"
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                </span>
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1"></div>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Close"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
          </div>

          {/* PDF Container */}
          <div className="flex-1 bg-slate-100/50 w-full relative">
            {/* Native browser PDF viewer provides the best performance, Zoom, Search, and Pagination out of the box */}
            <iframe
              src={`/api/materials/file?file=${encodeURIComponent(pdf.filename)}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-none"
              title={pdf.name}
              style={{ backgroundColor: '#f1f5f9' }}
            >
              <p>Your browser does not support PDFs. <a href={`/api/materials/file?file=${encodeURIComponent(pdf.filename)}`}>Download the PDF</a>.</p>
            </iframe>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
