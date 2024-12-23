import React, { useState } from 'react';
import './csvtojson.css';
import jsPDF from 'jspdf';

export default function Csvtojson() {
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file || !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      convertCsvToJson(text);
    };

    reader.readAsText(file);
  };

  const convertCsvToJson = (csv) => {
    const rows = csv.split('\n');
    const headers = rows[0].split(',').map((header) => header.trim());
    const data = rows.slice(1).map((row) => {
      const values = row.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index]?.trim();
      });
      return obj;
    });

    setJsonData(data.filter((item) => Object.keys(item).length > 0));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    alert('JSON data copied to clipboard!');
  };

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.json';
    link.click();
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    const jsonString = JSON.stringify(jsonData, null, 2);
    doc.text(jsonString, 10, 10); // Start text at 10,10 position
    doc.save('converted.pdf');
  };

  const downloadAsDoc = () => {
    const content = `<html>
      <head><title>Converted JSON</title></head>
      <body><pre>${JSON.stringify(jsonData, null, 2)}</pre></body>
    </html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.doc';
    link.click();
  };

  return (
    <div className="csvtojson-container">
      <h1 className="csvtojson-header">CSV to JSON Converter</h1>
      <input
        type="file"
        accept=".csv"
        className="csvtojson-input"
        onChange={handleFileUpload}
      />
      {error && <p className="csvtojson-error">{error}</p>}
      {jsonData.length > 0 && (
        <div className="csvtojson-output">
          <div className="csvtojson-buttons">
            <button className="csvtojson-button" onClick={copyToClipboard}>
              Copy JSON
            </button>
            <button className="csvtojson-button" onClick={downloadAsJson}>
              Download as JSON
            </button>
            <button className="csvtojson-button" onClick={downloadAsPdf}>
              Download as PDF
            </button>
            <button className="csvtojson-button" onClick={downloadAsDoc}>
              Download as DOC
            </button>
          </div>
          <pre className="csvtojson-textarea">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
