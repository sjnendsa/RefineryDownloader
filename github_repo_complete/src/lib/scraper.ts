/**
 * Texas Refinery PDF Scraper Core Functionality
 * 
 * This module contains the core functionality for scraping and downloading
 * Texas refinery PDF reports from the RRC website.
 */

export interface ScraperOptions {
  year: string;
  month?: string;
  facilityId?: string;
  userId?: string;
  maxThreads?: number;
}

export interface DownloadResult {
  success: boolean;
  fileCount: number;
  errorCount: number;
  errors: string[];
  downloadId: number;
}

export interface PDFLink {
  url: string;
  filename: string;
}

export class RefineryScraper {
  private baseUrl: string = 'https://www.rrc.texas.gov';
  private maxThreads: number = 10;
  private activePatterns: RegExp[] = [];
  
  constructor() {
    // Initialize with default pattern
    this.activePatterns = [
      new RegExp('(?P<year>\\d{4})[-_](?P<month>[a-z]+)[-_](?P<facility>\\d{2}-\\d{4})', 'i')
    ];
  }

  /**
   * Initialize the scraper by loading settings and regex patterns
   */
  async initialize(): Promise<void> {
    try {
      // Load active regex patterns
      const response = await fetch('/api/regex');
      if (response.ok) {
        const patterns = await response.json();
        if (patterns && patterns.length > 0) {
          this.activePatterns = patterns.map((p: any) => new RegExp(p.pattern, 'i'));
        }
      }
    } catch (error) {
      console.error('Error initializing scraper:', error);
    }
  }

  /**
   * Start the download process for refinery PDFs
   */
  async startDownload(options: ScraperOptions): Promise<DownloadResult> {
    const { year, month, facilityId, userId, maxThreads } = options;
    const threads = maxThreads || this.maxThreads;
    const errors: string[] = [];
    
    try {
      // Create download history record
      const response = await fetch('/api/scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          month,
          facilityId,
          userId: userId || 'anonymous'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start download process');
      }
      
      const data = await response.json();
      return {
        success: true,
        fileCount: data.fileCount || 0,
        errorCount: data.errorCount || 0,
        errors: data.errors || [],
        downloadId: data.downloadId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      
      // Log error
      this.logError(errorMessage);
      
      return {
        success: false,
        fileCount: 0,
        errorCount: 1,
        errors,
        downloadId: -1
      };
    }
  }

  /**
   * Log an error
   */
  private async logError(errorMessage: string): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error_message: errorMessage,
          user_id: 'anonymous'
        }),
      });
    } catch (error) {
      console.error('Error logging error:', error);
    }
  }
}
