'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegexManager() {
  const [patterns, setPatterns] = useState([
    {
      id: 1,
      name: 'Default Pattern',
      pattern: '(?P<year>\\d{4})[-_](?P<month>[a-z]+)[-_](?P<facility>\\d{2}-\\d{4})',
      description: 'Default pattern for parsing refinery PDF filenames',
      is_active: true
    },
    {
      id: 2,
      name: 'Alternative Pattern',
      pattern: '(?P<facility>\\d{2}-\\d{4})[-_](?P<year>\\d{4})[-_](?P<month>[a-z]+)',
      description: 'Alternative pattern for different filename format',
      is_active: true
    }
  ]);
  
  const [newPattern, setNewPattern] = useState({
    name: '',
    pattern: '',
    description: ''
  });
  
  const [testFilename, setTestFilename] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPattern(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newPattern.name || !newPattern.pattern) {
      setError('Name and pattern are required');
      return;
    }
    
    try {
      // For GitHub Pages demo, simulate API call
      const newId = Math.floor(Math.random() * 1000) + 3;
      
      // Add new pattern to state
      setPatterns(prev => [
        ...prev,
        {
          id: newId,
          name: newPattern.name,
          pattern: newPattern.pattern,
          description: newPattern.description,
          is_active: true
        }
      ]);
      
      // Reset form
      setNewPattern({
        name: '',
        pattern: '',
        description: ''
      });
      
      setSuccess('Pattern added successfully');
    } catch (err) {
      setError('Failed to add pattern');
      console.error(err);
    }
  };
  
  const testPattern = (patternStr: string) => {
    if (!testFilename) {
      setError('Please enter a filename to test');
      return;
    }
    
    try {
      const regex = new RegExp(patternStr, 'i');
      const match = regex.exec(testFilename);
      
      if (match) {
        // Extract named groups if available
        const groups: any = {};
        if (match.groups) {
          Object.keys(match.groups).forEach(key => {
            groups[key] = match.groups![key];
          });
        }
        
        setTestResults({
          matched: true,
          fullMatch: match[0],
          groups: Object.keys(groups).length > 0 ? groups : null
        });
      } else {
        setTestResults({
          matched: false
        });
      }
    } catch (err) {
      setError('Invalid regex pattern');
      console.error(err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Regex Pattern Manager</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Pattern</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Pattern Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPattern.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Standard Format"
            />
          </div>
          
          <div>
            <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-1">
              Regex Pattern
            </label>
            <input
              type="text"
              id="pattern"
              name="pattern"
              value={newPattern.pattern}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., (?P<year>\d{4})[-_](?P<month>[a-z]+)"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newPattern.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what this pattern is used for"
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Pattern
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Pattern</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="testFilename" className="block text-sm font-medium text-gray-700 mb-1">
              Test Filename
            </label>
            <input
              type="text"
              id="testFilename"
              value={testFilename}
              onChange={(e) => setTestFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2024-january-01-0123.pdf"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="border rounded-md p-4">
                <h3 className="font-medium">{pattern.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{pattern.pattern}</p>
                <button
                  onClick={() => testPattern(pattern.pattern)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                >
                  Test
                </button>
              </div>
            ))}
          </div>
          
          {testResults && (
            <div className={`mt-4 p-4 rounded-md ${testResults.matched ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-medium mb-2">
                {testResults.matched ? 'Pattern Matched!' : 'No Match Found'}
              </h3>
              
              {testResults.matched && (
                <div>
                  <p><span className="font-medium">Full Match:</span> {testResults.fullMatch}</p>
                  
                  {testResults.groups && (
                    <div className="mt-2">
                      <p className="font-medium">Captured Groups:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {Object.entries(testResults.groups).map(([key, value]: [string, any]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Active Patterns</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pattern
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patterns.map((pattern) => (
                <tr key={pattern.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pattern.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 font-mono">{pattern.pattern}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{pattern.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pattern.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pattern.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
