import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { year, month, facilityId, userId } = await request.json();
    
    if (!year) {
      return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 });
    }
    
    // For GitHub Pages demo, return mock data
    return NextResponse.json({
      success: true,
      fileCount: 120,
      errorCount: 0,
      errors: [],
      downloadId: Math.floor(Math.random() * 1000) + 1
    });
  } catch (error) {
    console.error('Error starting download:', error);
    return NextResponse.json(
      { error: 'Failed to start download process', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
