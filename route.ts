import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const downloadId = searchParams.get('id');
    
    if (!downloadId) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }
    
    // Get download info from database
    const download = await env.DB.prepare(
      'SELECT * FROM download_history WHERE id = ?'
    ).bind(downloadId).first();
    
    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    
    // In a real implementation, we would retrieve the actual PDF files
    // For this demo, we'll create a sample ZIP file with placeholder content
    const zip = new JSZip();
    
    // Add a README file
    zip.file('README.txt', `
Texas Refinery PDF Reports
==========================

This ZIP file contains refinery reports downloaded from the Texas Railroad Commission website.
Year: ${download.year}
${download.month ? `Month: ${download.month}` : 'All months'}
${download.facility_id ? `Facility ID: ${download.facility_id}` : 'All facilities'}

Files downloaded: ${download.file_count}
Errors encountered: ${download.error_count}

Download completed at: ${new Date(download.completed_at).toLocaleString()}
    `);
    
    // Create sample PDF content (just text in this demo)
    const samplePdfContent = 'This is a placeholder for PDF content. In the real application, this would be actual PDF data.';
    
    // Add sample files based on the download parameters
    const year = download.year;
    const months = download.month ? [download.month] : ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const facilities = download.facility_id ? [download.facility_id] : ['01-0001', '02-0002', '03-0003'];
    
    // Create folder structure and sample files
    for (const facility of facilities) {
      const folderName = facility;
      
      for (const month of months) {
        const monthAbbr = month.substring(0, 3).toLowerCase();
        const filename = `${facility}_${year}-${monthAbbr}.pdf`;
        
        zip.file(`${folderName}/${filename}`, samplePdfContent);
      }
    }
    
    // Generate ZIP file
    const zipContent = await zip.generateAsync({ type: 'arraybuffer' });
    
    // Create filename for download
    const filename = `texas_refinery_reports_${year}${download.month ? `_${download.month}` : ''}${download.facility_id ? `_${download.facility_id}` : ''}.zip`;
    
    // Return ZIP file
    return new Response(zipContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
}
