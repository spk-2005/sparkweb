  import React, { useEffect, useState } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import base from './airtable'; // Your Airtable configuration
import './typingresult.css';
  export default function TypingResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const { state } = location;
    const { level, totalTime, accuracy, misspelledWords, name } = state || {};

    useEffect(() => {
      if (!state) {
        setMessage('Result data is missing. Please complete the test first.');
      }
    }, [state]);

    const saveResultToAirtable = async () => {
      try {
        await base('typingresults').create([
          {
            fields: {
              Name: name,
              level: level,
              timetaken: totalTime,
              accuracy: parseFloat(accuracy),
              },
          },
        ]);
        setMessage('Result saved successfully!');
      } catch (error) {
        console.error('Error saving result:', error);
        setMessage('Error saving result.');
      }
      navigate(`/typingtest`);
    };
    if (!state) {
      return (
        <div>
          <h1>Error</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/typingtest')}>Go Back</button>
        </div>
      );
    }
    return (
      <>
      <section id='typingres-section'>
        <h1>Typing Test Results</h1>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Level:</strong> {level}</p>
        <p><strong>Total Time:</strong> {totalTime} seconds</p>
        <p><strong>Accuracy:</strong> {accuracy}%</p>
        <p><strong>Misspelled Words:</strong> {misspelledWords}</p>
        {message && <p>{message}</p>}
        <p>Save It To Know Your Rank</p>
        <button onClick={saveResultToAirtable}>Save Results</button>
        <button onClick={() => navigate('/typingtest')}>Back to Test</button>
        <h2>See Your Rank<span onClick={() => navigate('/typingranks')}>Click Here</span></h2>
      </section>
      </>
    );
  }
