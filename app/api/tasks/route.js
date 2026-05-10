import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // DOMAIN ISOLATION: Fetch tasks ONLY for the user's selected course
    const tasks = await Task.find({ domain: session.course }).sort({ batch: 1, createdAt: 1 });

    return NextResponse.json({ 
      success: true, 
      data: tasks 
    });

  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// For Admin to create new tasks
export async function POST(req) {
  try {
    await dbConnect();
    const session = await getSession();

    // SECURITY: Only allow Admins or Master Admin
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const taskData = await req.json();
    const task = await Task.create(taskData);

    return NextResponse.json({ success: true, data: task }, { status: 201 });

  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
