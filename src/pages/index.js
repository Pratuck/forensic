// Home.js (or wherever your Home component is defined)
import React from 'react';
import InputForm from '../components/InputForm';
import InfoResult from '../components/InfoResult';
import PostResult from '../components/PostResult';


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
  );
}

export default Home;