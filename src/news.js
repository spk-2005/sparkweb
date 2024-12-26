import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './news.css';

export default function News() {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0); // Track likes
  const { id, collection } = useParams();
  const containerRef = useRef(null); 

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/${collection}/${id}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPost(data); 
        setLikes(data.likes || 0); // Initialize likes from the fetched data
      })
      .catch((err) => console.error('Error fetching post:', err));
  }, [collection, id]); 

  const convertBinaryToBase64 = (binaryData) => {
    return `data:image/jpeg;base64,${binaryData}`;
  };

  const updateImageSrc = useCallback((htmlContent, images) => {
    if (!htmlContent) {
      console.error("htmlContent is undefined or null");
      return htmlContent;
    }
  
    let updatedContent = htmlContent;
  
    const imgTagRegex = /<img\s+([^>]*?src="[^"]*")[^>]*>/g;
  
    let match;
    let imgIndex = 0;
  
    while ((match = imgTagRegex.exec(updatedContent)) !== null) {
      if (images[imgIndex]) {
        const currentSrc = match[1];
        const newSrc = `src="${convertBinaryToBase64(images[imgIndex])}"`;
  
        updatedContent = updatedContent.replace(currentSrc, newSrc);
      }
      imgIndex++;
    }
  
    return updatedContent;
  }, []); 
  
  const applyStylesToPost = (htmlContent) => {
    const styleTags = htmlContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
    let styles = '';

    if (styleTags) {
      styleTags.forEach((tag) => {
        styles += tag.replace(/<style[^>]*>/, '').replace(/<\/style>/, '') + '\n';
      });
    }

    const contentWithoutStyles = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return { styles, contentWithoutStyles };
  };
  
  const applyShadowDOM = (styles, htmlContent) => {
    if (containerRef.current) {
      let shadowRoot = containerRef.current.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
      }
  
      shadowRoot.innerHTML = '';
  
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      shadowRoot.appendChild(styleElement);
  
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = htmlContent;
      shadowRoot.appendChild(contentDiv);
    }
  };
  
  useEffect(() => {
    if (post) {
      const { styles, contentWithoutStyles } = applyStylesToPost(updateImageSrc(post.post, post.images));
      applyShadowDOM(styles, contentWithoutStyles);
    }
  }, [post, updateImageSrc]);

  const handleLike = () => {
    setLikes(likes + 1); // Increment likes
    // Optionally, you can also send the updated like count to the server here
  };

  const handleShare = (platform) => {
    const url = window.location.href; // Current page URL to share
    let shareUrl = '';
    const postTitle = post ? post.title : "Check this post!";
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(postTitle)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(postTitle)}%20${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
  
    window.open(shareUrl, '_blank');
  };
  


  return (
    <section id="news-section">
      <div id="news-cont">
        {post ? (
          <>
            <div id="postnews">
              <div>
                <span>{post.views}<ion-icon name="eye-outline"></ion-icon></span>
                <span>{likes} Likes</span>
                <button onClick={handleLike}>Like</button>
              </div>
              <div ref={containerRef} />
              <div className="share-buttons">
                <button onClick={() => handleShare('facebook')}><ion-icon name="logo-whatsapp"></ion-icon></button>
                <button onClick={() => handleShare('twitter')}><ion-icon name="logo-twitter"></ion-icon></button>
                <button onClick={() => handleShare('whatsapp')}><ion-icon name="logo-whatsapp"></ion-icon></button>
              </div>
            </div>
          </>
        ) : (
          <p>No post available.</p>
        )}
      </div>
    </section>
  );
}
