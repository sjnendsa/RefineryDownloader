// Error logging utility for client-side error capture
// This will be used throughout the application to log errors and send them to the server

export interface ErrorLogData {
  error_message: string;
  stack_trace?: string;
  browser_info?: string;
  page_url?: string;
  user_id?: string;
}

class ErrorLogger {
  private userId: string = 'anonymous';
  
  /**
   * Set the current user ID for error attribution
   */
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  /**
   * Log an error to the server and optionally show a user-friendly message
   */
  async logError(error: Error | string, showToUser: boolean = false): Promise<boolean> {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const stackTrace = error instanceof Error ? error.stack : undefined;
      
      // Collect browser information
      const browserInfo = this.getBrowserInfo();
      
      // Create error log data
      const errorData: ErrorLogData = {
        error_message: errorMessage,
        stack_trace: stackTrace,
        browser_info: browserInfo,
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_id: this.userId
      };
      
      // Send error to server
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
      
      const result = await response.json();
      
      // Show error to user if requested
      if (showToUser && typeof window !== 'undefined') {
        alert(`An error occurred: ${errorMessage}\n\nThis has been reported to our support team.`);
      }
      
      return result.id !== undefined;
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
      return false;
    }
  }
  
  /**
   * Set up global error handlers to catch unhandled errors
   */
  setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;
    
    // Handle uncaught exceptions
    window.addEventListener('error', (event) => {
      this.logError(event.error || new Error(event.message));
      return false;
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      this.logError(error);
      return false;
    });
  }
  
  /**
   * Get browser and device information
   */
  private getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'Server-side';
    
    const { userAgent, platform } = navigator;
    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    
    return `${userAgent} | Platform: ${platform} | Screen: ${screenInfo}`;
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger();

// Export singleton
export default errorLogger;
