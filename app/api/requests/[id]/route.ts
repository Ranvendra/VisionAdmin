import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MovieRequest from '@/models/MovieRequest';

export async function DELETE(
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
    
    const deletedItem = await MovieRequest.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: 'Media request not found or already deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request successfully purged from index.'
    });
  } catch (error: any) {
    console.error('API DELETE Request Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while removing the request.',
      },
      { status: 500 }
    );
  }
}
