import React from 'react';
// import { Font,Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
// import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
// import { useState,useEffect } from 'react';
// import neo4j from 'neo4j-driver';

// const styles = StyleSheet.create({
//     page: {
//       flexDirection: 'column',
//     },
//     projectSection: {
//       margin: 10,
//       padding: 10,
//     },
//     postSection: {
//       margin: 10,
//       padding: 10,
//     },
//     projectTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 5,
//       },
//     postTitle: {
//       fontSize: 12,
//       marginBottom: 5,
//     },
//     image: {
//       width: 100,
//       height: 100,

//     },
   
      
//       // New style for section dividers
//       divider: {
//         marginVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#CCCCCC',
//       },
      
//       // New style for the header
//       header: {
//         fontSize: 24,
//         marginBottom: 10,
//         textAlign: 'center',
//         fontWeight: 'bold',
//       },
    
//       // New style for the footer
//       footer: {
//         fontSize: 12,
//         textAlign: 'center',
//         marginTop: 25,
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#CCCCCC',
//       },
    
//     // Add more styles as needed
//   });
  
  
  // Create Document Component
  // const MyDocument = ({ project, postData }) => (
  //   <Document>
  //     <Page size="A4" style={styles.page}>
  //       {/* Projects */}
  //       <Text style={styles.header}>Scraping Report</Text>
  //           {/* Projects */}
  //           {project.map((pro, index) => (
  //             <View key={index} style={styles.projectSection}>
  //               <Text style={styles.projectTitle}>{pro.projectname}</Text>
  //               <Text style={styles.projectTitle}>Task Start: {pro.datetime}</Text>
  //               <View style={styles.divider}></View>
  //             </View>
  //           ))}
  //           {/* Add footer */}
  //       {postData.map((post, index) => (
  //         <View key={index} style={styles.postSection}>
  //           <Text style={styles.postTitle}>{post.postUrl}</Text>
  //           <Text style={{fontSize:10}}>{post.text}</Text>
  //           <Text>Post timestamp: {post.datetime}</Text>
  //           {post.image.map((element, index) => (
  //             <Image key={index} style={styles.image} src={element} />
  //           ))}
  //         </View>
  //       ))}
  //     </Page>
  //   </Document>
    
  // );
  
const Report = () => {
//     const [pdfBlob, setPdfBlob] = useState(null);
//     const [project, setProject] = useState([]);
//     const [postData, setpostData] = useState([]);

//   useEffect(() => {
//     getProject();
//     getPost();
//   }, []);

//   const getProject = async () => {
//     const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
//     const session = driver.session({ database: "neo4j" });
//     try {
//       const result = await session.run(`MATCH (pro:Project) return pro`);
//       const formattedProjects = result.records.map(record => record.get('pro').properties);
//       setProject(formattedProjects);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       await session.close();
//     }
//   };

//   const getPost = async () => {
//     const driver = neo4j.driver("neo4j://127.0.0.1:7687", neo4j.auth.basic("neo4j", "pkp1212312121"));
//     const session = driver.session({ database: "neo4j" });
//     try {
//       const resultPost = await session.run(`MATCH (post:Post) return post`);
//       const formattedPostResult = resultPost.records.map(record => record.get('post').properties);
//       setpostData(formattedPostResult);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       await session.close();
//     }
//   };
//   useEffect(() => {
//     const generateBlob = async () => {
//       const blob = await MyDocument().toBlob();
//       setPdfBlob(blob);
//     };

//     generateBlob();
//   }, []);

  return (
    <div>
      {/* <PDFDownloadLink document={<MyDocument project={project} postData={postData} />} fileName="myfile.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
      </PDFDownloadLink>

      <PDFViewer width={600} height={800}>
        <MyDocument project={project} postData={postData} />
      </PDFViewer> */}
      Underdevelop
    </div>
  );
};

  export default Report