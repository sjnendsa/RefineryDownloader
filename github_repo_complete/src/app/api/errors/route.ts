import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();
    
    if (!errorData.error_message) {
      return NextResponse.json({ error: 'Error message is required' }, { status: 400 });
    }
    
    // For GitHub Pages demo, return success
    return NextResponse.json({ 
      id: Math.floor(Math.random() * 1000) + 1,
      success: true 
    });
  } catch (error) {
    console.error('Error logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const downloadId = searchParams.get('id');
    
    // For GitHub Pages demo, return mock data
    return NextResponse.json([
      {
        id: 1,
        download_id: downloadId ? parseInt(downloadId) : null,
        error_message: 'Failed to parse filename: facility_2024-jan.pdf',
        stack_trace: 'Error: Failed to parse filename\n    at parseFilename (/src/lib/scraper.ts:45:11)\n    at processFile (/src/lib/scraper.ts:78:22)',
        browser_info: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        page_url: 'https://example.com/texas-refinery-scraper',
        user_id: 'anonymous',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        download_id: downloadId ? parseInt(downloadId) : null,
        error_message: 'Network error: Failed to download PDF',
        stack_trace: 'Error: Network error\n    at downloadFile (/src/lib/scraper.ts:112:11)\n    at processDownload (/src/lib/scraper.ts:156:18)',
        browser_info: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        page_url: 'https://example.com/texas-refinery-scraper',
        user_id: 'anonymous',
        created_at: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error('Error fetching errors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}
