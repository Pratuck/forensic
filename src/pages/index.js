// Home.js (or wherever your Home component is defined)

import InputForm from '../components/InputForm';
import InfoResult from '../components/InfoResult';
import PostResult from '../components/PostResult';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';



function Home({
  inputValue,
  setInputValue,
  infoResult,
  setInfoResult,
  isSubmitting,
  setIsSubmitting,
  postResult,
  setPostResult,
  setProjectName,
  projectName
}) {
  // Render InputForm and InfoResult with the props if needed
  return (
    <div>
      <h1>This is Css453 Project :D</h1>
      <div className='my-container'>
      <InputForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        setInfoResult={setInfoResult} // setResult corresponds to setInfoResult
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        setPostResult={setPostResult}
        setProjectName={setProjectName}
        projectName={projectName}
      />
      <InfoResult infoResult={infoResult} />
      <PostResult postResult={postResult}/>
      </div>


      
    </div>
  );
}

export default Home;