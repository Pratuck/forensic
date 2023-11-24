// App.js
import React, { useState } from 'react';
import Navbar from './components/index.js'; // Assuming Navbar is the default export from the index.js file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index.js'; // Make sure to import the correct Home component
import View from './pages/view.js';
import Report from './pages/report.js'
import Graph from './pages/graph.js';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [projectName,setProjectName]=useState('')
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
            projectName={projectName}
            setProjectName={setProjectName}
          />
        } />
        <Route path='/view' element={
          <View/>
        }/>
        <Route path="/report" element={
          <Report/>
        }></Route>
        <Route path="/graph" element={
          <Graph/>
        }></Route>

      </Routes>
    </Router>
  );
}

export default App;