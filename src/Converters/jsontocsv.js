import React, { useState } from 'react';
import './jsontocsv.css';

export default function Jsontocsv() {
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');

  const convertToCSV = (json) => {
    const array = JSON.parse(json);
    if (!Array.isArray(array)) {
      throw new Error('Input should be a JSON array.');
    }

    const headers = Object.keys(array[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...array.map((row) => headers.map((header) => `"${row[header] || ''}"`).join(',')), // Data rows
    ];
    return csvRows.join('\n');
  };

  const handleDownload = () => {
    try {
      setError('');
      const csvData = convertToCSV(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Invalid JSON input. Please ensure it is an array of objects.');
    }
  };

  return (
    <div className="jsontocsv-container">
      <h1 className="jsontocsv-header">JSON to CSV Converter</h1>
      <textarea
        className="jsontocsv-textarea"
        placeholder="Enter JSON array here..."
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
      ></textarea>
      {error && <p className="jsontocsv-error">{error}</p>}
      <button className="jsontocsv-button" onClick={handleDownload}>
        Convert & Download CSV
      </button>
    </div>
  );
}
