import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return new NextResponse('File parameter missing', { status: 400 });
  }

  // Security: Prevent directory traversal attacks
  const cleanFileName = path.basename(file);
  const filePath = path.join(process.cwd(), 'materials', 'raw_pdfs', cleanFileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);
    
    // Convert Node.js stream to Web Stream
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      }
    });
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Length', stats.size.toString());
    // 'inline' tells the browser to open it in its internal viewer rather than downloading it
    headers.set('Content-Disposition', `inline; filename="${cleanFileName}"`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    return new NextResponse(webStream, { status: 200, headers });
  } catch (err) {
    console.error('Error serving PDF:', err);
    return new NextResponse('Error reading file', { status: 500 });
  }
}
