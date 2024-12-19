import React, { useEffect, useState } from 'react';
import base from './airtable'; // Import your Airtable configuration
import './typingranks.css';

export default function Typingranks() {
  const [rankings, setRankings] = useState({
    Easy: [],
    Medium: [],
    Hard: []
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from Airtable
  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const records = await base('typingresults').select().all();
        const data = records.map((record) => ({
          id: record.id,
          name: record.fields.Name,
          level: record.fields.level,
          accuracy: record.fields.accuracy,
          timeTaken: record.fields.timetaken
        }));

        // Separate data by levels and sort by accuracy (highest first)
        const easyRanks = data
          .filter((item) => item.level === 'easy')
          .sort((a, b) => b.accuracy - a.accuracy);
        const mediumRanks = data
          .filter((item) => item.level === 'medium')
          .sort((a, b) => b.accuracy - a.accuracy);
        const hardRanks = data
          .filter((item) => item.level === 'hard')
          .sort((a, b) => b.accuracy - a.accuracy);

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
    <section id="typinrank-section">
      <h1>Typing Ranks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="rankings-container">
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <div key={level} className="rank-section">
            <h2>{level} Level</h2>
            <ul>
              {rankings[level].length > 0 ? (
                rankings[level].map((user, index) => (
                  <li
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
                    <strong>{getRankSymbol(index)}</strong> {user.name} <br/> Accuracy: {user.accuracy*100}% <br/> Time: {user.timeTaken}s
                  </li>
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
