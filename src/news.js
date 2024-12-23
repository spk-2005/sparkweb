import React, { useEffect, useState } from 'react';

export default function News() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://spkhub-backend.onrender.com/api/post')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // Set the fetched data in state
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  return (
    <section id="news-section">
      <h1>All News</h1>
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
