import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './imagetotext.css';

export default function Imagetotext() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText('');
      setError('');
      setCopied(false);
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleExtractText = () => {
    if (!image) {
      setError('No image uploaded.');
      return;
    }

    Tesseract.recognize(
      image,
      'eng',
      {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setProgress(Math.round(info.progress * 100));
          }
        },
      }
    )
      .then(({ data: { text } }) => {
        setText(text);
        setError('');
        setProgress(100);
        setCopied(false);
      })
      .catch(() => {
        setError('Error extracting text. Please try again.');
        setProgress(0);
      });
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => setError('Failed to copy text.'));
    }
  };

  return (
    <div className="imagetotext-container">
      <h2 className="imagetotext-header">Image to Text Converter</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="imagetotext-input"
      />
      {image && (
        <div>
          <img src={image} alt="Uploaded Preview" className="imagetotext-image" />
          <button onClick={handleExtractText} className="imagetotext-button">
            Extract Text
          </button>
          {progress > 0 && progress < 100 && <p>Processing: {progress}%</p>}
        </div>
      )}
      {text && (
        <div>
          <textarea
            value={text}
            readOnly
            className="imagetotext-textarea"
            placeholder="Extracted text will appear here..."
          ></textarea>
          <button onClick={handleCopyText} className="imagetotext-button">
            Copy Text
          </button>
          {copied && <p className="imagetotext-success">Text copied to clipboard!</p>}
        </div>
      )}
      {error && <p className="imagetotext-error">{error}</p>}
    </div>
  );
}
