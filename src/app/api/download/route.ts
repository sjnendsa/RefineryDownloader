import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }
    
    // For GitHub Pages demo, return a mock download link
    // In a real implementation, this would generate a ZIP file with the downloaded PDFs
    return new Response(
      `This is a placeholder for the ZIP file download. In a real implementation, this would be a ZIP file containing the downloaded PDFs for download ID ${id}.`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="texas_refinery_reports_2024.zip"`,
        },
      }
    );
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
}
