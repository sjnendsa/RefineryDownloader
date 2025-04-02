'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LogsViewer() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      download_id: 123,
      error_message: 'Failed to parse filename: facility_2024-jan.pdf',
      stack_trace: 'Error: Failed to parse filename\n    at parseFilename (/src/lib/scraper.ts:45:11)\n    at processFile (/src/lib/scraper.ts:78:22)',
      browser_info: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      page_url: 'https://example.com/texas-refinery-scraper',
      user_id: 'anonymous',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      download_id: 124,
      error_message: 'Network error: Failed to download PDF',
      stack_trace: 'Error: Network error\n    at downloadFile (/src/lib/scraper.ts:112:11)\n    at processDownload (/src/lib/scraper.ts:156:18)',
      browser_info: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      page_url: 'https://example.com/texas-refinery-scraper',
      user_id: 'anonymous',
      created_at: new Date().toISOString()
    }
  ]);
  
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [filter, setFilter] = useState('');
  
  const filteredLogs = logs.filter(log => 
    log.error_message.toLowerCase().includes(filter.toLowerCase()) ||
    log.user_id.toLowerCase().includes(filter.toLowerCase())
  );
  
  const viewLogDetails = (log: any) => {
    setSelectedLog(log);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Error Logs</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter Logs
          </label>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Filter by error message or user ID"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">{log.error_message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{log.user_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewLogDetails(log)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No logs found matching your filter criteria
          </div>
        )}
      </div>
      
      {selectedLog && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Error Log Details</h2>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Error Message</h3>
              <p className="mt-1 text-sm text-gray-900">{selectedLog.error_message}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stack Trace</h3>
              <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded-md overflow-x-auto">
                {selectedLog.stack_trace}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Download ID</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.download_id || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.user_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Page URL</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.page_url}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Browser Info</h3>
              <p className="mt-1 text-sm text-gray-900">{selectedLog.browser_info}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
