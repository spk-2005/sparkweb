import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './newsportal.css';
export default function Newsportal() {
  const [posts, setPosts] = useState([]);
   const location=useLocation();
  const params = new URLSearchParams(location.search);
  const collectionName = params.get('category');
  const navigate = useNavigate();
  
  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/${collectionName}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [collectionName]);

  const handlePostClick = (id) => {
    navigate(`/news/${id}/${collectionName}`);
  };
  const main={
    entertainments:'Entertainment'
  }
  return (
    <>
    <div id='news-head'>
      <h1>Explore The exciting news about {main[collectionName]}</h1>
    </div>
    <section id='newsportal-section'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} onClick={() => handlePostClick(post._id)} id='newsover'>
            {post.thumbnail ? (<>
              <img src={`data:image/jpeg;base64,${post.thumbnail}`} alt="Thumbnail" />

              </>) : (
              <p>No Thumbnail Available</p>
            )}
            <h3>{post.title}</h3>
          </div>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </section>
      <div id='newsportal-advert'>
        <h1>Advertaisment</h1>
      </div>
    </>);
}
