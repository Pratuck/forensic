import React from 'react';
function InputForm({ inputValue, setInputValue, setInfoResult, isSubmitting, setIsSubmitting, setPostResult }) {

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);

      try {
        // Make the first POST request
        const infoResponse = await fetch('http://localhost:5000/api/scrape/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputValue }),
        });

        if (infoResponse.ok) {
          const infoData = await infoResponse.json();
          setInfoResult(infoData.result); 

          // Instead of making a second POST request, open an SSE connection
          const eventSource = new EventSource(`http://localhost:5000/api/scrape/posts?inputValue=${encodeURIComponent(inputValue)}`);

          eventSource.onmessage = (event) => {
            const newPost = JSON.parse(event.data);
            setPostResult((prevPosts) => [...prevPosts, newPost]);
          };

          eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setIsSubmitting(false);
          };

          // No need to handle the response like a typical fetch request
        } else {
          console.error('Error with the first request');
          // Handle the first request's non-OK response
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setInputValue(''); // Reset the input field
    setIsSubmitting(false); // Allow submission again
    setInfoResult(''); // Optionally reset the result if needed
    setPostResult('');
  };

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