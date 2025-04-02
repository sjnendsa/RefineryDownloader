import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const downloadId = searchParams.get('downloadId');
    
    if (!downloadId) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }
    
    // For GitHub Pages demo, return mock data
    return NextResponse.json({
      id: parseInt(downloadId),
      user_id: 'anonymous',
      year: '2024',
      month: null,
      facility_id: null,
      file_count: 120,
      status: 'completed',
      error_count: 0,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching download status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch download status' },
      { status: 500 }
    );
  }
}
