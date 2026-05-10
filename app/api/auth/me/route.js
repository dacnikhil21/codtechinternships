import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    const user = await User.findById(session.id).select('-password');

    if (!user) {
       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    console.error('Session Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
