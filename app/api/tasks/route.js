import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // DOMAIN ISOLATION: Fetch tasks ONLY for the user's selected course
    const tasks = await prisma.task.findMany({
      where: { domain: session.course },
      orderBy: [
        { batch: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      data: tasks 
    });

  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();

    // SECURITY: Only allow Admins
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const taskData = await req.json();
    const task = await prisma.task.create({
      data: taskData
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });

  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
