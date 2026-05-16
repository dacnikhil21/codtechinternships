import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const { fullName, email, internId, subject, message, captchaAnswer, num1, num2 } = await req.json();

    // Basic Validation
    if (!fullName || !email || !internId || !subject || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Human Verification (Captcha)
    if (parseInt(captchaAnswer) !== (num1 + num2)) {
      return NextResponse.json({ success: false, message: 'Verification failed. Please try again.' }, { status: 400 });
    }

    // Save to Database
    try {
      const [result] = await pool.execute(
        'INSERT INTO support_requests (fullName, email, internId, subject, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [fullName, email, internId, subject, message, 'Pending']
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Support Request Submitted Successfully',
        requestId: result.insertId 
      }, { status: 201 });

    } catch (dbError) {
      // If table doesn't exist, create it and retry
      if (dbError.errno === 1146 || dbError.code === 'ER_NO_SUCH_TABLE') {
        await pool.execute(`
          CREATE TABLE IF NOT EXISTS support_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            internId VARCHAR(100) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        
        const [retryResult] = await pool.execute(
          'INSERT INTO support_requests (fullName, email, internId, subject, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [fullName, email, internId, subject, message, 'Pending']
        );

        return NextResponse.json({ 
          success: true, 
          message: 'Support Request Submitted Successfully',
          requestId: retryResult.insertId 
        }, { status: 201 });
      }
      
      throw dbError;
    }

  } catch (error) {
    console.error('SUPPORT SUBMISSION ERROR:', error.message);
    return NextResponse.json({ success: false, message: 'Failed to submit request: ' + error.message }, { status: 500 });
  }
}
