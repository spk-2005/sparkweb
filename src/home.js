import React, { useEffect } from 'react'

export default function Home() {  
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://alwingulla.com/88/tag.min.js'; // Script source URL
  script.async = true;
  script.setAttribute('data-zone', '120573'); // Set the data-zone attribute
  script.setAttribute('data-cfasync', 'false'); // Set the data-cfasync attribute

  try {
    document.body.appendChild(script); // Append the script to the DOM
  } catch (error) {
    console.error('Error appending the script:', error);
  }

  return () => {
    // Cleanup the script on component unmount
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}, []);

  return (
    <div>
      <h1>Home</h1><div id="ad-container">Your Ad will appear here</div>
    </div>
  )
}
