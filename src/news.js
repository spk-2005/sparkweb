




import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export default function News() {
  const [post, setPost] = useState(null); // Single post state
  const { id, collection } = useParams();
  const containerRef = useRef(null); // Reference to the container for the post content

  useEffect(() => {
    // Construct the API URL dynamically using collection and id parameters
    const apiUrl = `http://localhost:5000/api/${collection}/${id}`;

    // Fetch data from the API for a specific post by id
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPost(data); // Set the fetched data in state for a single post
      })
      .catch((err) => console.error('Error fetching post:', err));
  }, [collection, id]); // Run this effect every time collection or id changes
  const convertBinaryToBase64 = (binaryData) => {
    return `data:image/jpeg;base64,${binaryData}`;
  };

  const updateImageSrc = useCallback((htmlContent, images) => {
    if (!htmlContent) {
      console.error("htmlContent is undefined or null");
      return htmlContent;
    }
  
    // Create a copy of the HTML content to work with
    let updatedContent = htmlContent;
  
    // Regular expression to match <img> tags and capture the src attribute
    const imgTagRegex = /<img\s+([^>]*?src="[^"]*")[^>]*>/g;
  
    // Find all img tags
    let match;
    let imgIndex = 0;
  
    // Loop through all the matched img tags
    while ((match = imgTagRegex.exec(updatedContent)) !== null) {
      if (images[imgIndex]) {
        const currentSrc = match[1];
        const newSrc = `src="${convertBinaryToBase64(images[imgIndex])}"`;
  
        // Replace the src attribute in the img tag
        updatedContent = updatedContent.replace(currentSrc, newSrc);
      }
      imgIndex++;
    }
  
    return updatedContent;
  }, []); // Empty dependency array means this function is memoized
  
  

  const applyStylesToPost = (htmlContent) => {
    // Extract <style> tags from the HTML content
    const styleTags = htmlContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
    let styles = '';

    if (styleTags) {
      styleTags.forEach((tag) => {
        // Append the style content
        styles += tag.replace(/<style[^>]*>/, '').replace(/<\/style>/, '') + '\n';
      });
    }

    // Remove the <style> tags from the HTML content
    const contentWithoutStyles = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return { styles, contentWithoutStyles };
  };
  
  const applyShadowDOM = (styles, htmlContent) => {
    if (containerRef.current) {
      // Check if shadow root already exists
      let shadowRoot = containerRef.current.shadowRoot;
      if (!shadowRoot) {
        // Create a shadow root if it doesn't exist
        shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
      }
  
      // Clear previous content in shadow root before adding new content
      shadowRoot.innerHTML = '';
  
      // Add the styles inside a <style> tag within the shadow DOM
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      shadowRoot.appendChild(styleElement);
  
      // Add the HTML content inside the shadow DOM
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = htmlContent;
      shadowRoot.appendChild(contentDiv);
    }
  };
  
useEffect(() => {
  if (post) {
    // Apply styles and HTML content to the Shadow DOM
    const { styles, contentWithoutStyles } = applyStylesToPost(updateImageSrc(post.post, post.images));
    applyShadowDOM(styles, contentWithoutStyles);
  }
}, [post, updateImageSrc]);

  return (
    <section id="news-section">
      <div id="news-cont">
        {post ? (
          // Only render the container for shadow DOM
          <div ref={containerRef} />
        ) : (
          <p>No post available.</p>
        )}
      </div>
    </section>
  );
}
