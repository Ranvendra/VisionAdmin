import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MovieRequest from '@/models/MovieRequest';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required.' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const updatedItem = await MovieRequest.findByIdAndUpdate(
      id, 
      { status: 'fulfilled' },
      { new: true }
    );
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Media request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request successfully marked as fulfilled.'
    });
  } catch (error: any) {
    console.error('API PATCH Request Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while fulfilling the request.',
      },
      { status: 500 }
    );
  }
}
