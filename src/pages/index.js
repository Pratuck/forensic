// Home.js (or wherever your Home component is defined)

import InputForm from '../components/InputForm';
// import InfoResult from '../components/InfoResult';
import PostResult from '../components/PostResult';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
// import neo4j from 'neo4j-driver';
import Swal from 'sweetalert2';


function Home({
  inputValue,
  setInputValue,
  setInfoResult,
  isSubmitting,
  setIsSubmitting,
  postResult,
  setPostResult,
  setProjectName,
  projectName
}) {
  // const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
  // const session = driver.session();

  // async function fetchGraphData() {
  //     const result = await session.run('CALL apoc.export.cypher.all("/home/ubuntu/Desktop/Forensic_project2/forensic/public/data/saved.cypher", {format: "cypher-shell"})');
      
  // }
  
  const endHandler = async () => {
    Swal.fire({
      title: "End scraping?",
      text: "every nodes and relationships will be deleted (underdevelopment)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, stop scraping!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        // fetchGraphData().then(data => {
        //   console.log('Fetched Graph Data:', JSON.stringify(data, null, 2));

        // });
        
      }
    });
  }
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
        <button style={{ backgroundColor: 'red', color: 'white' }} onClick={endHandler}> End Scaping</button>
        <PostResult postResult={postResult} />
      </div>
    </div>
  );
}

export default Home;