import React, { useEffect, useState } from 'react';

export default function News() {
  const [posts, setPosts] = useState([]);
  const collectionName='entertainments';
  useEffect(() => {
    // Construct the API URL dynamically using the collectionName prop
    const apiUrl = `https://spkhub-backend-1.onrender.com/api/${collectionName}`;
    
    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // Set the fetched data in state
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [collectionName]); // Run this effect every time collectionName changes

  return (
    <section id="news-section">
      <h1>All {collectionName}</h1>
      <div id="news-cont">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: post.post }} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </section>
  );
}
