import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return new NextResponse('File parameter missing', { status: 400 });
  }

  // Security: Prevent directory traversal attacks
  const cleanFileName = path.basename(fileName);
  const filePath = path.join(process.cwd(), 'materials', 'raw_pdfs', cleanFileName);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const stats = fs.statSync(filePath);
    
    // Create a Web-compatible ReadableStream directly from Node.js stream
    // This is more robust for Next.js/Vercel/Hostinger environments
    const nodeStream = fs.createReadStream(filePath);
    const stream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      }
    });
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Length', stats.size.toString());
    // 'inline' ensures it opens in browser instead of downloading
    headers.set('Content-Disposition', `inline; filename="${cleanFileName}"`);
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Accept-Ranges', 'bytes');
    
    return new NextResponse(stream, { 
      status: 200, 
      headers 
    });
  } catch (err) {
    console.error('Error serving PDF:', err);
    return new NextResponse('Error reading file', { status: 500 });
  }
}

