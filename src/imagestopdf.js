import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './imagestopdf.css';

export default function Imagestopdf() {
  const [images, setImages] = useState([]);
  const [width, setWidth] = useState(180);  // Default width
  const [height, setHeight] = useState(250); // Default height
  const canvasRef = useRef(null); // Reference to the canvas element

  const handleFileChange = (e) => {
    const files = e.target.files;
    const imageFiles = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imageFiles).then((loadedImages) => {
      setImages(loadedImages);
    });
  };

  // Draw images to canvas as a live preview
  useEffect(() => {
    if (images.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const aspectRatio = width / height;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

      // Set canvas height to fit all images
      const totalHeight = images.length * (height + 20);
      canvas.height = totalHeight;

      images.forEach((imageSrc, index) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
          // Calculate the new width and height based on aspect ratio and user inputs
          let imgWidth = width;
          let imgHeight = width / aspectRatio;

          // Adjust if height exceeds the user-defined height
          if (imgHeight > height) {
            imgHeight = height;
            imgWidth = height * aspectRatio;
          }

          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          // Calculate center position for the image
          const x = (canvasWidth - imgWidth) / 2; // Horizontal center
          const y = (canvasHeight - totalHeight + (imgHeight + 20) * index); // Vertical position with space

          ctx.drawImage(img, x, y, imgWidth, imgHeight);
        };
      });
    }
  }, [images, width, height]); // Re-render the canvas when images or width/height changes

  const handleConvertToPDF = () => {
    if (images.length === 0) {
      alert('Please select images first');
      return;
    }

    const doc = new jsPDF();
    
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let newWidth = width;
        let newHeight = width / aspectRatio;

        if (newHeight > height) {
          newHeight = height;
          newWidth = height * aspectRatio;
        }

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        const x = (pageWidth - newWidth) / 2;
        const y = (pageHeight - newHeight) / 2;

        // Add a new page if it's not the first image
        if (index > 0) {
          doc.addPage();
        }

        // Add image to the PDF at the center
        doc.addImage(image, 'JPEG', x, y, newWidth, newHeight);

        if (index === images.length - 1) {
          doc.save('converted-images.pdf');
        }
      };
    });
  };

  return (
    <section id='imagestopdf-section'>
      <div id='imagestopdf-cont'>
        <input type="file" accept="image/*" onChange={handleFileChange} multiple />
      </div>

      <div>
        <label>Width (px):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          min="50"
          max="250"
        />
      </div>

      <div>
        <label>Height (px):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          min="50"
          max="350"
        />
      </div>

      {images.length > 0 && (
        <div id='preview'>
          <h3>Preview:</h3>
          <canvas
            ref={canvasRef}
            width="600" // Canvas width
            height="800" // Canvas height (can adjust as needed)
            style={{ border: '1px solid black', marginTop: '20px' }}
          />
        </div>
      )}

      <button onClick={handleConvertToPDF}>Convert to PDF</button>
    </section>
  );
}
