import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import base from './airtable'; // Import Airtable configuration
import './typing.css';

export default function Typing() {  
  const [texts, setTexts] = useState([]); // Array of texts for the levels
  const [userInput, setUserInput] = useState(''); // User's input for the current text
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0); // Current sentence index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [timeRemaining, setTimeRemaining] = useState(0); // Time left for the test
  const [isTypingStarted, setIsTypingStarted] = useState(false); // Check if typing has started
  const [totalTypedChars, setTotalTypedChars] = useState(0); // Total characters typed
  const [totalCorrectChars, setTotalCorrectChars] = useState(0); // Total correct characters
  const [misspelledWords, setMisspelledWords] = useState(0); // Total misspelled words
  const { level, time } = useParams(); // Get the level and time from the URL params
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [height, setHeight] = useState(100); // Start at 100%
  const [background, setBackground] = useState('#f2f2f2');

  const timeInSeconds = React.useMemo(() => {
    return {
      '30seconds': 30,
      '1minute': 60,
      '5minutes': 300,
      '10minutes': 600,
      '30minutes': 1800,
    };
  }, []);

  const handleRedirect = useCallback(() => {
    const totalWords = texts[currentSentenceIndex]?.split(' ').length || 1; 
    const correctWords = texts[currentSentenceIndex]?.split(' ').filter((word, index) => {
        const typedWord = userInput.split(' ')[index];
        return word === typedWord;
    }).length || 0;
  
    const accuracy = (correctWords / totalWords) * 100 || 0;
    const wpm = (totalTypedChars / 5 / (parseInt(timeInSeconds[time] || 0) / 60)).toFixed(2);
    const timeTaken = parseInt(timeInSeconds[time] || 0) - timeRemaining;
  
    navigate('/typingresult', {
        state: {
            level,
            accuracy: accuracy.toFixed(2),
            wpm,
            timeTaken,
            name,
        },
    });
  }, [navigate, level, totalTypedChars,  time, name, currentSentenceIndex, texts, userInput, timeRemaining, timeInSeconds]);
  useEffect(() => {
    let timer;
    if (isTypingStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000); // Decrease by 1 second
    } else if (timeRemaining === 0 && isTypingStarted) {
      clearInterval(timer);
    }
  
    return () => clearInterval(timer);
  }, [isTypingStarted, timeRemaining]); // Removed 'handleRedirect'

  useEffect(() => {
    if (timeRemaining === 0 && isTypingStarted) {
      handleRedirect();
    }
  }, [timeRemaining, isTypingStarted, handleRedirect]);

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

          // Shuffle the texts array to ensure random order
          const shuffledTexts = allTexts.sort(() => Math.random() - 0.5);
          setTexts(shuffledTexts);
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
        setHeight((prevHeight) => {
          if (prevHeight > 0) {
            const heightDecrease = (100 / parseInt(timeInSeconds[time] || 0));
            const newHeight = prevHeight - heightDecrease;

            if (newHeight <= 45 && background !== 'rgb(255, 193, 193)') {
              setBackground('rgb(255, 193, 193)');
            }

            return newHeight;
          }

          return 0;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isTypingStarted) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isTypingStarted, timeRemaining, time, background,timeInSeconds]);

  const handleStart = () => {
    setTimeRemaining(timeInSeconds[time] || 0); // Convert time string to seconds
    setIsTypingStarted(true);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    const correctChars = input.split('').reduce((count, char, index) => {
      return count + (char === texts[currentSentenceIndex][index] ? 1 : 0);
    }, 0);

    setTotalCorrectChars(correctChars);
    setTotalTypedChars(input.length);

    const incorrectWords = input.split(' ').filter((word, idx) => {
      const originalWord = texts[currentSentenceIndex]?.split(' ')[idx];
      return word !== originalWord;
    }).length;
    setMisspelledWords(prev => prev + incorrectWords);

    if (input === texts[currentSentenceIndex]) {
      // Move to the next sentence, picking randomly
      const nextSentenceIndex = (currentSentenceIndex + 1) % texts.length;
      setCurrentSentenceIndex(nextSentenceIndex);
      setUserInput('');

      if (nextSentenceIndex === texts.length - 1) {
        handleRedirect();
      }
    }
  };

  const renderTextWithColors = () => {
    const originalText = texts[currentSentenceIndex] || '';
    const typedText = userInput;

    return originalText.split('').map((char, index) => {
      let color;
      let className = '';

      if (index < typedText.length) {
        if (char === typedText[index]) {
          color = 'green';
          className = 'highlight1';
        } else {
          color = 'red';
          className = 'highlight2';
        }
      } else {
        color = 'gray';
        className = '';
      }

      return (
        <span key={index} style={{ color }} className={className}>
          {char}
        </span>
      );
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      setUserInput(prevInput => prevInput.slice(0, prevInput.length));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <section id="typingtest-section">
      <h1>Your Name: {name}</h1>
      <div id="typingtest-cont">
        <h1>Typing Test: {level.toUpperCase()}</h1>
        {!isTypingStarted ? (
          <button onClick={handleStart} style={{ fontSize: '18px', padding: '10px 20px' }}>
            Start Typing
          </button>
        ) : (
          <>
            <div>
              <p className="time-remaining">
                <strong>Time Remaining:</strong> {timeRemaining} seconds
              </p>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(timeRemaining / parseInt(timeInSeconds[time] || 0)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <h1 style={{display:'none'}}>{totalCorrectChars}{misspelledWords}</h1>

            <p>
              <strong>Text:</strong>
            </p>
            <div
              style={{
                position: 'relative',
                fontSize:'30px',
                padding: '10px',
                lineHeight: '1.5',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}
              id="typebor"
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize:'30px',
                  position: 'absolute',
                  top: 0,
                  zIndex: 1,
                  pointerEvents: 'visible',
                }}
              >
                {renderTextWithColors()}
              </div>
              <textarea
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{
                  fontWeight: 'bold',
                  background: 'transparent',
                  color: 'transparent',
                  caretColor: 'black',
                  border: 'none',
                  width: '100%',
                  height: '100px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                  position: 'relative',
                  left:'-9px',
                  outline: 'none',
                  resize: 'none',
                  fontSize:'30px',
                  whiteSpace: 'pre-wrap',
                }}
                autoFocus
              />
              <style>
                {`
                  #typebor::before {
                    height: ${height}% !important;
                    background:${background};
                  }
                `}
              </style>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
