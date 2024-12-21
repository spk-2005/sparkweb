import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import base from './airtable'; 
import './typingtest.css';
import Typingranks from './typingranks';
export default function Typingtest() { 
 
 
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('');

  const handleLevel = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel); 
  };
  const handleGo = async () => {
    const userName = name.trim() || `Guest_${Math.floor(Math.random() * 1000)}`;
  
    if (!level) {
      setMessage('Please select a difficulty level.');
      return;
    }
  
    try {
      const records = await base('typingusers')
        .select({
          filterByFormula: `{Name} = "${userName}"`, 
        })
        .firstPage();
  
      if (records.length > 0) {
        setMessage('Welcome back! You are now logged in.');
  
        navigate(`/typingtime/${level.toLowerCase()}/${userName}`);
      } else {
        await base('typingusers').create([
          {
            fields: { Name: userName },
          },
        ]);
        setMessage('Registration successful! You are now registered.');
        navigate(`/typingtime/${level.toLowerCase()}/${userName}`);
        localStorage.setItem('name', userName);
      }
    } catch (error) {
      console.error('Error checking or saving name:', error);
      setMessage('An error occurred while checking or saving the name.');
    }
  };
  
  return (
    <> <div id="ad-container">Ad will load here...</div>
    <section id="typintest-section">
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {message && <p style={{ color: 'red' }}>{message}</p>} 
      <div id="typintest-cont">
        <h1>Test Your Typing Skills</h1>
        <div>
          <select onChange={handleLevel} value={level}>
            <option value="">Select Level</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button onClick={handleGo}>Go</button>
        </div>
      </div>
    </section>
    <Typingranks/>
    </>
  );
}
