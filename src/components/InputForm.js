import React from 'react';

function InputForm({ inputValue, setInputValue, setInfoResult, isSubmitting, setIsSubmitting ,setPostResult}) {

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
  
          const postResponse = await fetch('http://localhost:5000/api/scrape/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputValue }),
          });
  
          if (postResponse.ok) {
            const postData = await postResponse.json();
            setPostResult(postData.posts); // Use 'results' here instead of 'result'
          }else {
            console.error('Error with the second request');
            // Handle the second request's non-OK response
          }
        } else {
          console.error('Error with the first request');
          // Handle the first request's non-OK response
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
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
