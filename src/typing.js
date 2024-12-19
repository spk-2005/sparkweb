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
const name=localStorage.getItem('name');
  const handleRedirect = useCallback(() => {
    navigate('/typingresult', {
      state: {
        level, 
        totalTime,
        accuracy,
        misspelledWords,
        name,
      },
    });
  }, [navigate, level, totalTime, accuracy, misspelledWords,name]);

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
          setTexts(allTexts); // Set texts as an array of sections
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

    return () => clearInterval(timer); // Cleanup interval on unmount or when the test ends
  }, [isTypingStarted, timeRemaining, handleRedirect]);

  const handleStart = () => {
    setTimeRemaining(parseInt(time)); // Initialize timer with value from params
    setIsTypingStarted(true);
    setStartTime(Date.now()); // Set the start time
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (startTime === null && input.length > 0) {
      setStartTime(Date.now()); // Start time when the user begins typing
    }

    calculateAccuracy();
    calculateMisspelledWords();

    if (input === texts[0]) {
      setTotalTime((prevTime) => prevTime + (Date.now() - startTime) / 1000); // Add time to total
      setUserInput(''); // Reset user input for the next section
      setTexts((prevTexts) => prevTexts.slice(1)); // Remove the completed section and show the next
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
    setAccuracy(overallAccuracy.toFixed(2));
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
    let color = 'gray'; // Default color is gray for placeholder

    if (userInput[index] !== undefined) {
      color = userInput[index] === char ? '#009933' : '#e60000'; // Green for correct, red for incorrect
    }

    return (
      <span key={index} style={{ color: color, transition: 'color 0.3s ease' }}>
        {char}
      </span>
    );
  });

  return (
    <section id="typingtest-section">
    <h1>Your name : {name}</h1>
      <div id="typingtest-cont">
        <h1>Typing Test: {level.toUpperCase()}</h1>
        {!isTypingStarted ? (
          <button
            onClick={handleStart}
            style={{
              fontSize: '18px',
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Start Typing
          </button>
        ) : (
          <>
            <p><strong>Time Remaining:</strong> {timeRemaining} seconds</p>
            <p><strong>Text:</strong></p>
            <div style={{ fontSize: '18px', lineHeight: '1.5', transition: 'opacity 1s ease', fontWeight: 'bold' }}>
              {coloredText}
            </div>
            <form>
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Start typing here..."
                rows="5"
                cols="50"
                style={{
                  fontSize: '18px',
                  width: '100%',
                  lineHeight: '1.5',
                  padding: '10px',
                  border: '1px solid #ccc',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.3s ease',
                }}
              />
            </form>
          
          </>
        )}
      </div>
    </section>
  );
}
