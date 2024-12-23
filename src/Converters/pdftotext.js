import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export default function Pdftotext() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            extractedText += pageText + '\n';
          }
          setText(extractedText);
        } catch (err) {
          setError('Error reading PDF. Please try again.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>PDF to Text Converter</h2>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <textarea
        value={text}
        readOnly
        rows="20"
        cols="80"
        style={{ marginTop: '20px', width: '100%', height: '300px' }}
        placeholder="Extracted text will appear here..."
      ></textarea>
    </div>
  );
}
