'use client';

import { useState, useEffect } from 'react';
import errorLogger from '@/lib/errorLogger';

export default function ProgressTracker({ downloadId }: { downloadId: number | null }) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('pending');
  const [fileCount, setFileCount] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize error logger
    errorLogger.setupGlobalErrorHandlers();
    
    // Reset state when downloadId changes
    if (downloadId) {
      setIsLoading(true);
      setProgress(0);
      setStatus('pending');
      setFileCount(0);
      setErrorCount(0);
      setError(null);
      
      // Start polling for status
      const statusInterval = setInterval(() => {
        fetchStatus();
      }, 1000);
      
      return () => clearInterval(statusInterval);
    }
  }, [downloadId]);

  const fetchStatus = async () => {
    if (!downloadId) return;
    
    try {
      const response = await fetch(`/api/status?downloadId=${downloadId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch download status');
      }
      
      const data = await response.json();
      
      // Update state with status data
      setStatus(data.status);
      setFileCount(data.file_count);
      setErrorCount(data.error_count);
      
      // Calculate progress
      if (data.status === 'completed' || data.status === 'completed_with_errors') {
        setProgress(100);
        setIsLoading(false);
      } else if (data.file_count > 0) {
        // Estimate progress based on typical month having ~30 files
        // This is a simplified approach - in a real app, we'd have better progress tracking
        const estimatedTotal = 360; // 12 months * 30 files
        const progressValue = Math.min(Math.round((data.file_count / estimatedTotal) * 100), 99);
        setProgress(progressValue);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      errorLogger.logError(err, false);
    }
  };

  if (!downloadId) {
    return null;
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Download Progress</h2>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">Status: {status.replace(/_/g, ' ').toUpperCase()}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Files Downloaded</p>
              <p className="text-xl font-semibold text-blue-700">{fileCount}</p>
            </div>
            
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-xl font-semibold text-red-700">{errorCount}</p>
            </div>
          </div>
          
          {status === 'completed' && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p className="font-medium">Download Complete!</p>
              <p className="mt-1">
                Successfully downloaded {fileCount} files.
              </p>
              <div className="mt-3">
                <a
                  href={`/api/download?id=${downloadId}`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Download ZIP File
                </a>
              </div>
            </div>
          )}
          
          {status === 'completed_with_errors' && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="font-medium">Download Completed with Errors</p>
              <p className="mt-1">
                Downloaded {fileCount} files with {errorCount} errors.
              </p>
              <div className="mt-3 flex space-x-3">
                <a
                  href={`/api/download?id=${downloadId}`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Download ZIP File
                </a>
                <a
                  href={`/api/errors?id=${downloadId}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  View Errors
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
