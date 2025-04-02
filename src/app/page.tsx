'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressTracker from '@/components/ProgressTracker';
import errorLogger from '@/lib/errorLogger';
import { RefineryScraper } from '@/lib/scraper';

export default function Home() {
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [facilityId, setFacilityId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [downloadId, setDownloadId] = useState<number | null>(null);

  const months = [
    { value: '', label: 'All Months' },
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' },
  ];

  // Fetch available years on component mount
  useEffect(() => {
    // Initialize error logger
    errorLogger.setupGlobalErrorHandlers();
    
    const fetchYears = async () => {
      try {
        // For GitHub Pages demo, use current year and 4 previous years
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
          years.push((currentYear - i).toString());
        }
        setAvailableYears(years);
        setSelectedYear(years[0]);
      } catch (error) {
        console.error('Error fetching years:', error);
        setError('Failed to fetch available years');
        errorLogger.logError(error instanceof Error ? error : String(error), false);
      }
    };

    fetchYears();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedYear) {
      setError('Please select a year');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const scraper = new RefineryScraper();
      await scraper.initialize();
      
      const result = await scraper.startDownload({
        year: selectedYear,
        month: selectedMonth,
        facilityId: facilityId || undefined,
      });
      
      if (!result.success) {
        setError(result.errors[0] || 'Failed to start download process');
        setIsLoading(false);
        return;
      }
      
      setDownloadId(result.downloadId);
    } catch (error) {
      console.error('Error starting download:', error);
      setError('Failed to start download process');
      setIsLoading(false);
      errorLogger.logError(error instanceof Error ? error : String(error), false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Texas Refinery Reports Downloader</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Select Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Year</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Select Month (Optional)
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
              Facility ID (Optional)
            </label>
            <input
              type="text"
              id="facilityId"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              placeholder="e.g., 01-0123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a facility ID to download reports for a specific facility only
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
              disabled={isLoading || !selectedYear}
            >
              {isLoading ? 'Processing...' : 'Start Download'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading && downloadId && (
          <ProgressTracker downloadId={downloadId} />
        )}
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/regex"
              className="px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Manage Regex Patterns
            </Link>
            <Link
              href="/admin/logs"
              className="px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              View Error Logs
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Email Settings
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Texas Refinery Reports Downloader Web Application</p>
          <p>© {new Date().getFullYear()} - All rights reserved</p>
        </div>
      </div>
    </main>
  );
}
