import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import base from './airtable'; // Your Airtable configuration
import './typingresult.css';

export default function TypingResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { state } = location;
  const { level, totalTime, accuracy, name, wpm } = state || {};

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
            timetaken: Number(totalTime), // Ensure this is a number
            accuracy: accuracy / 100, // Percentage in decimal format
            wpm:parseFloat(wpm),
          },
        },
      ]);
      setMessage('Result saved successfully!');
    } catch (error) {
      console.error('Error saving result:', error);
      setMessage('Error saving result.');
    }
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

  const AccuracyCircle = ({ percent }) => {
    return (
      <div className="circle" style={{ background: `conic-gradient(#34d399 ${percent}%, #f87171 ${percent}% 100%)` }}>
        <p>{percent}%</p>
      </div>
    );
  };

  const WPMCircle = ({ percent }) => {
    return (
      <div className="circle" style={{ background: `conic-gradient(#34d399 ${percent}%, #f87171 ${percent}% 100%)` }}>
        <p>{percent} WPM</p>
      </div>
    );
  };

  return (
    <>
      <section id='typingres-section'>
        <h1>Typing Test Results</h1>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Level:</strong> {level}</p>
        <div className="circle-container">
          <div>
            <h3>Accuracy</h3>
            <AccuracyCircle percent={accuracy} />
          </div>
          <div>
            <h3>WPM</h3>
            <WPMCircle percent={wpm} />
          </div>
        </div>
        <p><strong>Total Time:</strong> {totalTime} seconds</p>
        {message && <p>{message}</p>}
        <p>Save It To Know Your Rank</p>
        <button onClick={saveResultToAirtable}>Save Results</button>
        <button onClick={() => navigate('/typingtest')}>Back to Test</button>
        <h2>See Your Rank<span onClick={() => navigate('/typingranks')}>Click Here</span></h2>
      </section>
    </>
  );
}
