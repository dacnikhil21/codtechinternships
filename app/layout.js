import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Codtech Intern',
  description: 'The Official Codtech Internship Portal. Learn. Build. Grow.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
