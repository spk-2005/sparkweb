import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './texttopdf.css';

export default function Texttopdf() {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleConvertToPDF = () => {
    if (text.trim() === '') {
      alert('Please enter some text');
      return;
    }

    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save('text-to-pdf.pdf');
  };

  return (
    <section id='texttopdf-section'>
      <div id='texttopdf-cont'>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to convert to PDF..."
          rows="10"
          cols="50"
        />
      </div>
      <button onClick={handleConvertToPDF}>Convert to PDF</button>
    </section>
  );
}
