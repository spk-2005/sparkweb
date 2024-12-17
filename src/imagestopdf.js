import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './imagestopdf.css';

export default function Imagestopdf() {
  const [images, setImages] = useState([]);

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
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate the aspect ratio to maintain the original dimensions
        const aspectRatio = imgWidth / imgHeight;
        
        // Set the maximum width and height for the image on the PDF page
        const maxWidth = 180;  // Define your maximum width here
        const maxHeight = 250;  // Define your maximum height here

        let width = maxWidth;
        let height = maxWidth / aspectRatio;

        // If the height exceeds maxHeight, scale down by height instead
        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }

        if (index > 0) {
          doc.addPage(); 
        }

        // Add image to PDF while maintaining the aspect ratio
        doc.addImage(image, 'JPEG', 15, 40, width, height);
        
        // If it's the last image, save the PDF
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
      {images.length > 0 && (
        <div id='prev'>
          <h3>Preview:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {images.map((image, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <img
                  src={image}
                  alt={`Preview ${index}`}
                  style={{
                    width: '100px',
                    maxHeight: '100px',
                    objectFit: 'contain',
                    overflow: 'hidden', // Hide overflow in preview
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleConvertToPDF}>Convert to PDF</button>
    </section>
  );
}
