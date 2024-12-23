
import { useNavigate, useParams } from 'react-router-dom';
import './typingtime.css'; 
import { useEffect } from 'react';

export default function Typingtime() {   
    
    
    useEffect(() => {
    const domain = 'cimtaiphos.com'; // Update with the new domain
    const identifier = 8685060; // Update with the new identifier

    // Create the script element
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://${domain}/401/${identifier}`;

    // Try appending the script
    try {
      (document.body || document.documentElement).appendChild(scriptElement);
      console.log('Script loaded successfully.');
    } catch (error) {
      console.error('Error appending the script:', error);
    }

    // Cleanup: Remove the script when the component is unmounted
    return () => {
      if (scriptElement) {
        scriptElement.remove();
        console.log('Script removed.');
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  
    const { level,name} = useParams();
    const navigate = useNavigate();
    localStorage.setItem('name',name);
    const handleTest = (time) => {
        navigate(`/typing/${level}/${time}`);
    };

    return (
        <><div id="ad-container"></div>
            <section className="typingtime-section">
                <div className="typingtime-container">
                    <h1>Select Typing Test Duration</h1>
                    <ol className="typingtime-list">
                        <li onClick={() => handleTest('30seconds')}>30 Seconds</li>
                        <li onClick={() => handleTest('1minute')}>1 Minute</li>
                        <li onClick={() => handleTest('5minutes')}>5 Minutes</li>
                        <li onClick={() => handleTest('10minutes')}>10 Minutes</li>
                        <li onClick={() => handleTest('30minutes')}>30 Minutes</li>
                    </ol>
                </div>
            </section>
        </>
    );
}
