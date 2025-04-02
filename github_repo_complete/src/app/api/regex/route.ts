import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For GitHub Pages demo, return mock data
    return NextResponse.json([
      {
        id: 1,
        name: 'Default Pattern',
        pattern: '(?P<year>\\d{4})[-_](?P<month>[a-z]+)[-_](?P<facility>\\d{2}-\\d{4})',
        description: 'Default pattern for parsing refinery PDF filenames',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Alternative Pattern',
        pattern: '(?P<facility>\\d{2}-\\d{4})[-_](?P<year>\\d{4})[-_](?P<month>[a-z]+)',
        description: 'Alternative pattern for different filename format',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error('Error fetching regex patterns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regex patterns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, pattern, description } = await request.json();
    
    if (!name || !pattern) {
      return NextResponse.json({ error: 'Name and pattern are required' }, { status: 400 });
    }
    
    // For GitHub Pages demo, return success
    return NextResponse.json({ 
      id: Math.floor(Math.random() * 1000) + 3,
      success: true 
    });
  } catch (error) {
    console.error('Error creating regex pattern:', error);
    return NextResponse.json(
      { error: 'Failed to create regex pattern' },
      { status: 500 }
    );
  }
}
