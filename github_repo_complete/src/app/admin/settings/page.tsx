'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    notification_email: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    send_on_error: true,
    send_on_completion: true
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success?: boolean; message?: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{success?: boolean; message?: string} | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveResult(null);
    
    try {
      // For GitHub Pages demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveResult({
        success: true,
        message: 'Settings saved successfully'
      });
    } catch (error) {
      setSaveResult({
        success: false,
        message: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // For GitHub Pages demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTestResult({
        success: true,
        message: 'Test email sent successfully'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to send test email'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Notification Settings</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Email Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="notification_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Email
                </label>
                <input
                  type="email"
                  id="notification_email"
                  name="notification_email"
                  value={settings.notification_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Where to send error notifications and reports
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">SMTP Server Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  id="smtp_host"
                  name="smtp_host"
                  value={settings.smtp_host}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="smtp.gmail.com"
                />
              </div>
              
              <div>
                <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="text"
                  id="smtp_port"
                  name="smtp_port"
                  value={settings.smtp_port}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="587"
                />
              </div>
              
              <div>
                <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Username
                </label>
                <input
                  type="text"
                  id="smtp_user"
                  name="smtp_user"
                  value={settings.smtp_user}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="smtp_pass" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="smtp_pass"
                  name="smtp_pass"
                  value={settings.smtp_pass}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send_on_error"
                  name="send_on_error"
                  checked={settings.send_on_error}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="send_on_error" className="ml-2 block text-sm text-gray-700">
                  Send notification on errors
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send_on_completion"
                  name="send_on_completion"
                  checked={settings.send_on_completion}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="send_on_completion" className="ml-2 block text-sm text-gray-700">
                  Send notification when download completes
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            
            <button
              type="button"
              onClick={handleTestEmail}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isTesting || !settings.notification_email || !settings.smtp_host || !settings.smtp_user || !settings.smtp_pass}
            >
              {isTesting ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
          
          {saveResult && (
            <div className={`p-4 rounded-md ${saveResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {saveResult.message}
            </div>
          )}
          
          {testResult && (
            <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {testResult.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
