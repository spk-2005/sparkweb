import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import base from './airtable'; // Your Airtable configuration

export default function Typingresult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [message, setMessage] = useState(''); // To display success/error messages

  // Avoiding re-renders by performing logic in useEffect
  useEffect(() => {
    if (!state) {
      setMessage('Result data is missing. Please complete the test first.');
    }
  }, [state]);

  if (!state) {
    // Return error page if state is missing
    return (
      <div>
        <h1>Error</h1>
        <p>{message}</p>
        <button onClick={() => navigate('/typingtest')}>Go Back</button>
      </div>
    );
  }

  const { level, totalTime, accuracy, misspelledWords, name } = state;

  const misspelledWordsList = Array.isArray(misspelledWords) ? misspelledWords : [];

  const numericTime = Number(totalTime);

  const isValidTime = !isNaN(numericTime) && numericTime !== 0;

  // Function to save result to Airtable
  const saveResultToAirtable = async () => {
    if (!isValidTime) {
      setMessage('Invalid time value.');
      return;
    }

    try {
      const tableaccuracy=accuracy/100;
      await base('typingresults').create([
        {
          fields: {
            Name: name,
            level: level,
            accuracy: tableaccuracy,
          },
        },
      ]);
      setMessage('Result saved successfully!');
    } catch (error) {
      console.error('Error saving result:', error);
      setMessage('Error saving result. Please try again later.');
    }
  };

  return (
    <section>
      <h1>Typing Test Results</h1>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Level:</strong> {level}</p>
      <p><strong>Total Time Taken:</strong> {numericTime} seconds</p>
      <p><strong>Accuracy:</strong> {accuracy}%</p>
      <p><strong>Misspelled Words:</strong> {misspelledWordsList.length > 0 ? misspelledWordsList.join(', ') : 'None'}</p>

      {/* Display success or error message */}
      {message && <p>{message}</p>}

      {/* Button to save the result */}
      <button onClick={saveResultToAirtable}>Save Results</button>

      {/* Button to go back to the typing test */}
      <button onClick={() => navigate('/typingtest')}>Back to Test</button>
    </section>
  );
}
