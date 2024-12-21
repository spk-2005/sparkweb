import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import base from './airtable';
import './typing.css';

export default function Typing() {
  const [texts, setTexts] = useState([]);
  const [userInput, setUserInput] = useState('');
  const currentSentenceIndex = 0; 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [timeRemaining, setTimeRemaining] = useState(0); 
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [misspelledWords, setMisspelledWords] = useState(0);
  const { level, time } = useParams(); 
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [height, setHeight] = useState(100); 
  const [background, setBackground] = useState('#f2f2f2');


  useEffect(() => {
    const handleClickOutside = (event) => {
      const typingArea = document.getElementById('typingtest-cont');
      if (!typingArea.contains(event.target)) {
        document.getElementById('typebor').focus();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const timeInSeconds = React.useMemo(() => {
    return {
      '30seconds': 30,
      '1minute': 60,
      '5minutes': 300,
      '10minutes': 600,
      '30minutes': 1800,
    };
  }, []);
const [typed,settyped]=useState();
  const handleRedirect = useCallback(() => {
    const correctWords = texts[currentSentenceIndex]?.split(' ').filter((word, index) => {
        const typedWord = userInput.split(' ')[index];
        return word === typedWord;
    }).length || 0;
  
    const accuracy = (correctWords / typed) * 100 || 0;
    const timeInSecondsValue = parseInt(timeInSeconds[time] || 0); 
const timeInMinutes = timeInSecondsValue > 0 ? timeInSecondsValue / 60 : 1;
const wpm = correctWords > 0 && timeInMinutes > 0 ? correctWords/timeInMinutes : 0;

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
  }, [navigate, level,  time, name, currentSentenceIndex, texts, userInput,typed, timeRemaining, timeInSeconds]);

  useEffect(() => {
    let timer;
    if (isTypingStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTypingStarted) {
      clearInterval(timer);
    }
  
    return () => clearInterval(timer);
  }, [isTypingStarted, timeRemaining]);

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
            maxRecords: 1,
          })
          .firstPage();
  
        if (records.length > 0) {
          const singleText = records[0].fields[levelField];
          setTexts([singleText]);
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
    setTimeRemaining(timeInSeconds[time] || 0);
    setIsTypingStarted(true);
  };

  const textAreaRef = useRef(null);
  const handleInputChange = (e) => { 
    const input = e.target.value;
    setUserInput(input);

    const originalWords = texts[0]?.split(' ') || [];
    const typedWords = input.split(' ');

    const correctWords = typedWords.filter((word, index) => word === originalWords[index]).length;

    const totalTypedWords = typedWords.length;
    
    setTotalCorrectChars(correctWords);
    settyped(totalTypedWords);

    const incorrectWords = typedWords.filter((word, idx) => word !== originalWords[idx]).length;
    setMisspelledWords(prev => prev + incorrectWords);

    if (input === texts[0]) {
      handleRedirect();
    }
};

  const renderTextWithColors = () => {
    const originalText = texts[currentSentenceIndex] || '';
    const typedText = userInput;
  
    return originalText.split('').map((char, index) => {
      let color;
      let className='';
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
        <span
          key={index} className={className}
          style={{
            color,
            transition: 'color 0.3s ease',
            fontWeight: 'bold',
            letterSpacing: '1px',
            wordSpacing: '10px',
          }}
        >
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

  const preventCursorOutside = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div id="ad-container"></div>
      <section id="typingtest-section">
        <h1 style={{display:'none'}}>{totalCorrectChars}{misspelledWords}{height}</h1>
        <div id="typingtest-cont">
          <div id='casula'>
            <h1>Your Name: {name}</h1>
            <h1>Typing Test: {level.toUpperCase()}</h1>
          </div>

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

              <p>
                <strong>Text:</strong>
              </p>
              <div
                id='typebor2'
                style={{
                  position: 'relative',
                  fontSize: '30px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                  padding: '20px',
                  fontWeight: 'bold',
                  whiteSpace: 'wrap',
                  overflowX: 'auto',
                  width: '100%',
                }}
              >
                <div
                  id='typebor2'
                  style={{
                    transform: `translateY(${-userInput.length * 1.2}px)`,
                    transition: 'transform 0.2s ease',
                    fontWeight: 'bold',
                    fontSize: '30px',
                    position: 'absolute',
                    top: 0,
                    pointerEvents: 'none',
                    padding: '20px',
                    zIndex: 1,
                    overflowX: 'auto',
                  }}
                >
                  {renderTextWithColors()}
                </div>
                <textarea
                  id="typebor"
                  ref={textAreaRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => document.getElementById('typebor').focus()}
                  style={{
                    fontWeight: 'bold',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    height: '250px',
                    overflowX: 'auto',
                    lineHeight: '1.5',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    resize: 'none',
                  }}
                  onClick={preventCursorOutside}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
