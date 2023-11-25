import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import neo4j from 'neo4j-driver';

const Graph = () => {
    const container = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState([]);
    const nodeMap = useRef(new Map()).current;
    const fetchData = async () => {
        const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
        const session = driver.session({ database: "socialforen" });
        try {

            const accountResult = await session.run(`MATCH (account:Account) return account`);
            const postResult = await session.run(`MATCH (post:Post) return post`);
            const commentResult = await session.run(`MATCH (comment:Comment) return comment`);

            let newNodes = [];
            accountResult.records.forEach(record => {
                const node = {
                    id: record.get('account').identity.toNumber(),
                    label: record.get('account').properties.username,
                    color: 'lightblue',
                    shape: 'ellipse',
                    properties: record.get('account').properties
                }
                newNodes.push(node);
                nodeMap.set(node.id, node);
            });
            postResult.records.forEach(record => {
                let fullLabel = record.get('post').properties.text.join(" ");

                const maxCharCount = 30;

                if (fullLabel.length > maxCharCount) {
                    fullLabel = fullLabel.substring(0, maxCharCount) + '...';
                }

                const node = {
                    id: record.get('post').identity.toNumber(),
                    label: fullLabel,
                    color: 'orange',
                    shape: 'ellipse',
                    properties: record.get('post').properties
                }
                newNodes.push(node);
                nodeMap.set(node.id, node);
            });

            commentResult.records.forEach(record => {
                const node = {
                    id: record.get('comment').identity.toNumber(),
                    label: record.get('comment').properties.text,
                    color: 'lightgreen',
                    shape: 'ellipse',
                    properties: record.get('comment').properties
                }
                newNodes.push(node);
                nodeMap.set(node.id, node);
            });



            setNodes(newNodes);
            const relationshipsPosts = await session.run(`
      MATCH (account:Account)-[r:POSTED]->(post:Post)
      RETURN account, r, post
    `);
            const relationComments = await session.run(`
     match (a:Account)-[r:POSTED]->(c:Comment) return a,r,c
   `);
            const relationReplies = await session.run(`
     match (c:Comment)-[r:REPLIED]->(p:Post) return p,r,c
   `);
            const relationLikes = await session.run(`
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
    useEffect(() => {
        fetchData();
    }, []); 

    useEffect(() => {
        if (nodes.length > 0 && edges.length > 0) {
            console.log('Initializing network with fetched data');
            network.current = new Network(container.current, { nodes, edges }, {});
    
            network.current.on('click', params => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    setSelectedNodeId(nodeId);
                }
            });
        }
    }, [nodes, edges]);;

    const renderNodeDetails = () => {
        if (!selectedNodeId) return null;
        const node = nodeMap.get(selectedNodeId);
        if (!node) return <div>No details available for the selected node.</div>;
        return (
            <div style={{ display: 'flex' }}>
                <div>
                    <div><p><span style={{ color: 'blue' }}>Node ID: </span>{node.id}</p></div>
                    <div><p><span style={{ color: 'blue' }}>Node Label: </span>{node.label}</p></div>
                    {node.properties && Object.entries(node.properties).map(([key, value]) => (
                        <div key={key}><p><span style={{ color: 'blue' }}>{key}:</span>{value}</p></div>
                    ))}
                </div>
                <div>
                {node.properties.image && Object.entries(node.properties.image).map(([key, value]) => (
                        <img key={key} src={value}  alt='' />
                        
                    ))}

                </div>
            </div>
        );
    };


    return (
        <div>
            <h1>The Graph visualize is below please, refresh if you don't see anything</h1>
            {renderNodeDetails()}
            <div ref={container} style={{ height: '800px', width: '100vw' }} />

        </div>
    );
};

export default Graph;
