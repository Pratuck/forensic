import React, { useState, useRef, useEffect } from 'react';
import DatePicker from "react-datepicker";
import '../pages/index.css'
import DateTimePicker from 'react-datetime-picker';
function InputForm({ inputValue, setInputValue, isSubmitting, setIsSubmitting, setPostResult, setProjectName, projectName }) {
  const eventSourceRef = useRef(null);
  const [isEventSourceClosed, setIsEventSourceClosed] = useState(false);

  const [date, setDate] = useState(new Date());
  // const [startDate, setStartDate] = useState();
  // const [endDate, setEndDate] = useState();
  const [dateTimeValueStart,setDateTimeValueStart]=useState();
  const [dateTimeValueEnd,setDateTimeValueEnd]=useState();

  // const handleChange = (range) => {
  //   const [startDate, endDate] = range;
  //   setStartDate(startDate);
  //   setEndDate(endDate);
  // };


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
        body: JSON.stringify({ projectName,dateTimeValueStart,dateTimeValueEnd,inputValue }),
      });
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      return; // Exit early if fetch fails
    }

    // Create a new EventSource
    try {
      eventSourceRef.current = new EventSource(`http://localhost:5000/api/scrape/posts?inputValue=${encodeURIComponent(inputValue)}&startDate=${dateTimeValueStart}&endDate=${dateTimeValueEnd}`);
      eventSourceRef.current.onmessage = (event) => {
        const newPost = JSON.parse(event.data);
        if (newPost.post === "view") {
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
            placeholder='profile Url'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSubmitting}
          />
        </label>
        Task Name:
        <input
          type="text"
          placeholder='project name'
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isSubmitting}
        />
        <label>
          Start:
        <DateTimePicker
        onChange={setDateTimeValueStart}
        value={dateTimeValueStart}
        returnValue='range'
        />
        </label>
        <label>
          End:
          <DateTimePicker
          onChange={setDateTimeValueEnd}
          value={dateTimeValueEnd}
          returnValue='range'
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