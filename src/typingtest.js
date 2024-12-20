import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import base from './airtable'; // Import your Airtable configuration
import './typingtest.css';
import Typingranks from './typingranks';
export default function Typingtest() {  
  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://alwingulla.com/88/tag.min.js'; // Script source
  script.async = true;
  script.setAttribute('data-zone', '120573'); // Set data-zone attribute
  script.setAttribute('data-cfasync', 'false'); // Set data-cfasync attribute

  try {
    document.body.appendChild(script); // Append the script to the body
  } catch (error) {
    console.error('Error appending the script:', error);
  }

  return () => {
    // Cleanup script when the component is unmounted
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}, []);

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [message, setMessage] = useState(''); // To display the message
  const [level, setLevel] = useState(''); // To track the selected level

  // Handle changes to the difficulty level selection
  const handleLevel = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel); // Set the selected level
  };
  const handleGo = async () => {
    // Default the name to "Guest_1" if no name is entered
    const userName = name.trim() || `Guest_${Math.floor(Math.random() * 1000)}`;
  
    if (!level) {
      setMessage('Please select a difficulty level.');
      return;
    }
  
    try {
      // Check if the name already exists in the 'typingusers' table
      const records = await base('typingusers')
        .select({
          filterByFormula: `{Name} = "${userName}"`, // Filter by the 'Name' field
        })
        .firstPage();
  
      // If the name already exists (existing user)
      if (records.length > 0) {
        setMessage('Welcome back! You are now logged in.');
  
        // Navigate to the selected level
        navigate(`/typingtime/${level.toLowerCase()}/${userName}`);
      } else {
        // If the name does not exist (new user)
        // Save the new user to Airtable
        await base('typingusers').create([
          {
            fields: { Name: userName },
          },
        ]);
        setMessage('Registration successful! You are now registered.');
  
        // Navigate to the selected level
        navigate(`/typingtime/${level.toLowerCase()}/${userName}`);
        localStorage.setItem('name', userName);
      }
    } catch (error) {
      console.error('Error checking or saving name:', error);
      setMessage('An error occurred while checking or saving the name.');
    }
  };
  
  return (
    <><div id="ad-container">
    Ad content should load here.
  </div>
  
    <section id="typintest-section">
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {message && <p style={{ color: 'red' }}>{message}</p>} {/* Display error message */}
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
