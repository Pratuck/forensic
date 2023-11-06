// App.js
import React, { useState } from 'react';
import Navbar from './components/index.js'; // Assuming Navbar is the default export from the index.js file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index.js'; // Make sure to import the correct Home component

function App() {
  const [inputValue, setInputValue] = useState('');
  const [infoResult, setInfoResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postResult,setPostResult]=useState('')

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={
          <Home
            inputValue={inputValue}
            setInputValue={setInputValue}
            infoResult={infoResult}
            setInfoResult={setInfoResult}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            postResult={postResult}
            setPostResult={setPostResult}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
