import React, { useState, useRef, useEffect } from 'react';

function InputForm({ inputValue, setInputValue, isSubmitting,setIsSubmitting, setPostResult, setProjectName, projectName }) {
  const eventSourceRef = useRef(null);
  const [isEventSourceClosed, setIsEventSourceClosed] = useState(false);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (eventSourceRef.current) {
      console.log('EventSource already exists.');
      return; // Exit if an EventSource is already open
    }

    setIsSubmitting(true);

    try {
      // Your POST fetch logic here
      await fetch('http://localhost:5000/api/create-neo4j-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      return; // Exit early if fetch fails
    }

    // Create a new EventSource
    try {
      eventSourceRef.current = new EventSource(`http://localhost:5000/api/scrape/posts?inputValue=${encodeURIComponent(inputValue)}`);
      eventSourceRef.current.onmessage = (event) => {
        const newPost = JSON.parse(event.data);
        if(newPost.post==="view"){
          eventSourceRef.current.close()
          eventSourceRef.current = null;
          setIsEventSourceClosed(true); // Ensure this is set to prevent reopening
          setIsSubmitting(false);
        }
        setPostResult((prevPosts) => [...prevPosts, newPost]);
      };

      eventSourceRef.current.onerror = (event) => {
        console.log('EventSource error or closed by the server');
        eventSourceRef.current.close()
        eventSourceRef.current = null;
        setIsEventSourceClosed(true); // Ensure this is set to prevent reopening
        setIsSubmitting(false);
      };
    } catch (err) {
      console.error('EventSource failed:', err);
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsEventSourceClosed(true);
    setInputValue('');
    setIsSubmitting(false);
    setPostResult([]);
    setProjectName('');
  };

  // ...rest of your component
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input URL:
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSubmitting}
        />
      </label>
      Project Name:
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default InputForm;
