import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { homeworkId, userId } = body;

    // For demo purposes, just return success
    // In a real implementation, this would update the database
    return NextResponse.json({
      success: true,
      message: 'Homework marked as complete',
      homeworkId,
      userId,
      completedAt: new Date(),
    });
  } catch (error) {
    console.error('Error completing homework:', error);
    return NextResponse.json(
      { error: 'Failed to complete homework' },
      { status: 500 }
    );
  }
} 