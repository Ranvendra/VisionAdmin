import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MovieRequest from '@/models/MovieRequest';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '5', 10));
    const skip = (page - 1) * limit;

    const [total, requests] = await Promise.all([
      MovieRequest.countDocuments({}),
      MovieRequest.find({})
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('API GET Requests Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch media requests.',
      },
      { status: 500 }
    );
  }
}
