import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Codtech Intern',
  description: 'The Official Codtech Internship Portal.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #f8f9ff; font-family: 'Inter', sans-serif; margin: 0; }
          .gradient-bg { 
            background: radial-gradient(circle at 10% 20%, rgba(215, 223, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%),
                        radial-gradient(circle at 90% 80%, rgba(111, 251, 190, 0.1) 0%, rgba(255, 255, 255, 0) 50%);
            min-height: 100vh;
          }
          /* Critical Branding Fallback */
          .bg-blue-700 { background-color: #1d4ed8 !important; }
          .text-white { color: #ffffff !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('ChunkLoadError')) {
              window.location.reload();
            }
          }, true);
        `}} />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
