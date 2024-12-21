import React, { useEffect, useState } from 'react';
import base from './airtable';
import './typingranks.css';

export default function Typingranks() {
 
  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://groleegni.net/401/8685114';  // URL from the provided script
    scriptElement.async = true; // Make sure the script loads asynchronously

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
  }, []);
  useEffect(() => {
    const domain = 'groleegni.net';
    const identifier = 8685066;

    // Create a new script element
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://${domain}/401/${identifier}`;

    try {
      // Append the script to the body or document root
      (document.body || document.documentElement).appendChild(scriptElement);
      console.log('External script loaded successfully.');
    } catch (error) {
      console.error('Error appending the external script:', error);
    }

    // Cleanup: Remove script on component unmount
    return () => {
      if (scriptElement) {
        scriptElement.remove();
        console.log('External script removed.');
      }
    };
  }, []); 

  useEffect(() => {
    // Define variables as in the script
    const domain = 'vemtoutcheeg.com';
    const identifier = 8685031;

    // Create a script element
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://${domain}/400/${identifier}`;

    try {
      // Append script to the body or document
      (document.body || document.documentElement).appendChild(scriptElement);
      console.log('Script loaded successfully');
    } catch (error) {
      console.error('Error appending the script:', error);
    }

    // Cleanup: Remove script when component unmounts
    return () => {
      if (scriptElement) {
        scriptElement.remove();
        console.log('Script removed');
      }
    };
  }, []); // Empty dependency array ensures it runs only on component mount

  const [rankings, setRankings] = useState({
    Easy: [],
    Medium: [],
    Hard: []
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const records = await base('typingresults').select().all();
        const data = records.map((record) => ({
          id: record.id,
          name: record.fields.Name,
          level: record.fields.level,
          accuracy: record.fields.accuracy,
          timeTaken: record.fields.timetaken,
          wpm: record.fields.wpm 
        }));

        const easyRanks = data
          .filter((item) => item.level === 'easy')
          .sort((a, b) => {
            if (b.accuracy === a.accuracy) {
              return b.wpm - a.wpm; 
            }
            return b.accuracy - a.accuracy; 
          });
        const mediumRanks = data
          .filter((item) => item.level === 'medium')
          .sort((a, b) => {
            if (b.accuracy === a.accuracy) {
              return b.wpm - a.wpm; 
            }
            return b.accuracy - a.accuracy; 
          });
        const hardRanks = data
          .filter((item) => item.level === 'hard')
          .sort((a, b) => {
            if (b.accuracy === a.accuracy) {
              return b.wpm - a.wpm; 
            }
            return b.accuracy - a.accuracy; 
          });

        setRankings({
          Easy: easyRanks,
          Medium: mediumRanks,
          Hard: hardRanks
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ranks:', err);
        setError('Failed to fetch rankings. Please try again later.');
        setLoading(false);
      }
    };

    fetchRanks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const getRankSymbol = (index) => {
    switch (index) {
      case 0:
        return '👑';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };  

  return (
    <section id="typinrank-section"><div id="ad-container"></div>
      <h1>Ranks Your Friend Get</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="rankings-container">
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <div key={level} className="rank-section">
            <h2>{level} Level</h2>
            <ul>
              {rankings[level].length > 0 ? (
                rankings[level].map((user, index) => (
                 <a href='https://whomeenoaglauns.com/4/8685074' style={{textDecoration:'none',color:'inherit'}}> <li
                    key={user.id}
                    className={
                      index === 0
                        ? 'rank-1'
                        : index === 1
                        ? 'rank-2'
                        : index === 2
                        ? 'rank-3'
                        : ''
                    }
                  >
                    <strong>{getRankSymbol(index)}</strong> {user.name}
                    <div className="details">
                      Accuracy: {user.accuracy * 100}% <br />
                      WPM: {user.wpm} <br />
                      Time: {user.timeTaken}s
                    </div>
                  </li></a>
                ))
              ) : (
                <p>No results available.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
