import React, { useEffect } from 'react'

export default function Home() {  
  
  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://vemtoutcheeg.com/400/8674727';
  script.async = true;

  try {
    (document.body || document.documentElement).appendChild(script);
  } catch (e) {
    console.error('Error appending the script:', e);
  }

  return () => {
    // Clean up the script if the component is unmounted
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
