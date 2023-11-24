import React, { useState, useEffect } from "react";
import neo4j from 'neo4j-driver';

function View() {
  const [project, setProject] = useState([]);
  const [postData, setPostDate] = useState([])

  useEffect(() => {
    getProject();
    getPost();
  }, []);

  const getProject = async () => {
    const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
    const session = driver.session({ database: "socialforen" });
    try {
      const result = await session.run(`MATCH (pro:Project) return pro`);
      const formattedProjects = result.records.map(record => record.get('pro').properties);
      setProject(formattedProjects);
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  };

  const getPost = async () => {
    const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
    const session = driver.session({ database: "socialforen" });
    try {
      const resultPost = await session.run(`MATCH (post:Post) return post`);
      const formattedPostResult = resultPost.records.map(record => record.get('post').properties);
      setPostDate(formattedPostResult);
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  };

  // Function to format the datetime
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <div>
        {project.map((pro, index) => (
          <div key={index}>
            <h4>{pro.projectname}</h4>
            <span>Project Start:{formatDateTime(pro.datetime)}</span>
            {/* Add more components as needed */}
          </div>
        ))}
      </div>
      <div>
        {postData.map((post, index) => (
          <div key={index}>
            <p>------------------------------------------------------------------------------------------------------------------------</p>
            <h3 >{post.postUrl}</h3>
            <span><span style={{ color: 'blue' }}>Post content:</span>{post.text}</span>
            <p><span style={{ color: 'blue' }}>Post timestamp:</span> {post.datetime}</p>
            <p><span style={{ color: 'blue' }}>Images:</span> </p>
            {
              post.image.map((element, index) => (
                <img key={index} src={element} alt={element}  />
              ))
            }
          </div>
        ))}
      </div>

    </div>
  );
}

export default View;
