import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return new NextResponse('File parameter missing', { status: 400 });
  }

  // Security: Prevent directory traversal attacks
  const cleanFileName = path.basename(decodeURIComponent(file));
  const filePath = path.join(process.cwd(), 'materials', 'raw_pdfs', cleanFileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    // 'inline' tells the browser to open it in its internal viewer rather than downloading it
    headers.set('Content-Disposition', `inline; filename="${cleanFileName}"`);
    
    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (err) {
    console.error('Error serving PDF:', err);
    return new NextResponse('Error reading file', { status: 500 });
  }
}
