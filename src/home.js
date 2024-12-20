import { useEffect, useState } from "react";

export default function Home() {  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://groleegni.net/401/8678589';
    script.async = true;

    // Set a handler for when the script loads successfully
    script.onload = () => {
      setIsLoading(false); // Set loading to false when the script is loaded
    };

    // Set a handler for when the script fails to load
    script.onerror = () => {
      setIsLoading(false); // Set loading to false even on error
      setHasError(true); // Mark the error state as true
    };

    // Append the script to the document body
    try {
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      setIsLoading(false);
      setHasError(true);
    }

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="ad-container">
        {isLoading ? (
          <p>Loading ad...</p> // Display while the script is loading
        ) : hasError ? (
          <p>Ad failed to load. Please try again later.</p> // Display error message if script fails
        ) : (
          <p>Ad content will load here.</p> // Placeholder for successful script load
        )}
      </div>
    </>
  );
}
