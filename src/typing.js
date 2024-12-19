import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import base from './airtable'; // Import Airtable configuration
import './typing.css';

export default function Typing() {
  const [texts, setTexts] = useState([]); // Array of texts for the levels
  const [userInput, setUserInput] = useState(''); // User's input for the current text
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [accuracy, setAccuracy] = useState(0); // Overall accuracy
  const [misspelledWords, setMisspelledWords] = useState(0); // Total count of misspelled words
  const [totalTime, setTotalTime] = useState(0); // Total time across all stages
  const [startTime, setStartTime] = useState(null); // Track start time for the current stage
  const [timeRemaining, setTimeRemaining] = useState(0); // Time left for the test
  const [isTypingStarted, setIsTypingStarted] = useState(false); // Check if typing has started
  const { level, time } = useParams(); // Get the level and time from the URL params
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleRedirect = useCallback(() => {
    navigate('/typingresult', {
      state: {
        level,
        totalTime: totalTime.toFixed(2), // Ensure total time is passed correctly
        accuracy: accuracy.toFixed(2),
        misspelledWords,
        name,
      },
    });
  }, [navigate, level, totalTime, accuracy, misspelledWords, name]);

  useEffect(() => {
    const fetchTexts = async () => {
      setLoading(true);
      setError(null);

      try {
        const levelField = level === 'easy' ? 'Easy' : level === 'medium' ? 'Medium' : 'Hard';

        const records = await base('TypingTest')
          .select({
            filterByFormula: `{${levelField}} != ""`,
          })
          .firstPage();

        if (records.length > 0) {
          const allTexts = records.map((record) => record.fields[levelField]);
          setTexts(allTexts);
        } else {
          setError('No texts available for the selected level.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, [level]);

  useEffect(() => {
    let timer;
    if (isTypingStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTypingStarted) {
      clearInterval(timer);
      handleRedirect();
    }

    return () => clearInterval(timer);
  }, [isTypingStarted, timeRemaining, handleRedirect]);

  const handleStart = () => {
    setTimeRemaining(parseInt(time));
    setIsTypingStarted(true);
    setStartTime(Date.now());
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (startTime === null && input.length > 0) {
      setStartTime(Date.now());
    }

    calculateAccuracy();
    calculateMisspelledWords();

    if (input === texts[0]) {
      setTotalTime((prevTime) => prevTime + (Date.now() - startTime) / 1000);
      setUserInput('');
      setTexts((prevTexts) => prevTexts.slice(1));
    }
  };

  const calculateAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < Math.min(userInput.length, texts[0]?.length); i++) {
      if (userInput[i] === texts[0][i]) {
        correct++;
      }
    }

    const overallAccuracy = (correct / texts[0]?.length) * 100;
    setAccuracy(overallAccuracy);
  };

  const calculateMisspelledWords = () => {
    let misspelled = 0;
    for (let i = 0; i < Math.max(texts[0]?.length, userInput.length); i++) {
      if (texts[0]?.[i] !== userInput[i]) {
        misspelled++;
      }
    }
    setMisspelledWords(misspelled);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const coloredText = texts[0]?.split('').map((char, index) => {
    let color = 'gray';

    if (userInput[index] !== undefined) {
      color = userInput[index] === char ? '#009933' : '#e60000';
    }

    return (
      <span key={index} style={{ color: color, transition: 'color 0.3s ease' }}>
        {char}
      </span>
    );
  });

  return (
    <section id="typingtest-section"><span id="note">
    <p><strong>Note:</strong></p>
    The timer will continue if you make any errors or remain idle. It stops when you type correctly without interruption.
  </span>
  

      <h1>Your Name: {name}</h1>
      <div id="typingtest-cont">
        <h1>Typing Test: {level.toUpperCase()}</h1>
        {!isTypingStarted ? (
          <button onClick={handleStart} style={{ fontSize: '18px', padding: '10px 20px' }}>
            Start Typing
          </button>
        ) : (
          <>
            <p><strong>Time Remaining:</strong> {timeRemaining} seconds</p>
            <p><strong>Text:</strong></p>
            <div>{coloredText}</div>
            <textarea value={userInput} onChange={handleInputChange} placeholder="Start typing here..." rows="5" />
          </>
        )}
      </div>
    </section>
  );
}
