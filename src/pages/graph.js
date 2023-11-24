import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import neo4j from 'neo4j-driver';

const Graph = () => {
  const container = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const fetchData = async () => {
    const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
    const session = driver.session({ database: "socialforen" });
    try {

      const accountResult = await session.run(`MATCH (account:Account) return account`);
      const postResult = await session.run(`MATCH (post:Post) return post`);
      const commentResult = await session.run(`MATCH (comment:Comment) return comment`);

      let newNodes = [];
      accountResult.records.forEach(record => {
        newNodes.push({
          id: record.get('account').identity.toNumber(),
          label: record.get('account').properties.username,
          color: 'lightblue', 
          shape: 'ellipse' 
        });
      });
      postResult.records.forEach(record => {
        newNodes.push({
          id: record.get('post').identity.toNumber(),
          label: record.get('post').properties.text.join(" "),
          color: 'orange', 
          shape: 'ellipse' 
        });
      });
      commentResult.records.forEach(record => {
        newNodes.push({
          id: record.get('comment').identity.toNumber(),
          label: record.get('comment').properties.text,
          color: 'lightgreen', 
          shape: 'ellipse' 
        });
        
      });



      setNodes(newNodes);
      const relationshipsPosts = await session.run(`
      MATCH (account:Account)-[r:POSTED]->(post:Post)
      RETURN account, r, post
    `);
     const relationComments= await session.run(`
     match (a:Account)-[r:POSTED]->(c:Comment) return a,r,c
   `);
   const relationReplies= await session.run(`
     match (c:Comment)-[r:REPLIED]->(p:Post) return p,r,c
   `);
   const relationLikes= await session.run(`
     match (a:Account)-[r:REACTED]->(p:Post) return p,r,a
   `);

    let newEdges = [];
    relationshipsPosts.records.forEach(record => {
      newEdges.push({
        from: record.get('account').identity.toNumber(),
        to: record.get('post').identity.toNumber(),
        label: record.get('r').type, 
        arrows: 'to' 
      });
    });
    relationComments.records.forEach(record => {
        newEdges.push({
          from: record.get('a').identity.toNumber(),
          to: record.get('c').identity.toNumber(),
          label: record.get('r').type, 
          arrows: 'to' 
        });
      });
      relationReplies.records.forEach(record => {
        newEdges.push({
          from: record.get('c').identity.toNumber(),
          to: record.get('p').identity.toNumber(),
          label: record.get('r').type, 
          arrows: 'to' 
        });
      });
      relationLikes.records.forEach(record => {
        newEdges.push({
          from: record.get('a').identity.toNumber(),
          to: record.get('p').identity.toNumber(),
          label: record.get('r').type, 
          arrows: 'to' 
        });
      });

    // Update edges state
    setEdges(newEdges);


    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  };
   const network = useRef(null);
   useEffect(()=>{
    fetchData();
   })
  useEffect(() => {

    if (nodes.length > 0 && edges.length > 0) {
        network.current = new Network(container.current, { nodes, edges }, {interaction:{
            dragNodes:true,
            dragView: true,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            hideNodesOnDrag: false,
            hover: true,
            hoverConnectedEdges: true,
            keyboard: {
              enabled: false,
              speed: {x: 10, y: 10, zoom: 0.02},
              bindToWindow: true,
              autoFocus: true,
            },
            multiselect: false,
            navigationButtons: false,
            selectable: true,
            selectConnectedEdges: true,
            tooltipDelay: 300,
            zoomSpeed: 1,
            zoomView: true
          }});

    }
  }, [nodes, edges]);

  return (
    <div>
        <h1>The Graph visualize is below please, refresh if you don't see anything</h1>
    <div ref={container} style={{ height: '1000px', width: '2000px' }} />
    </div>
  );
};

export default Graph;
