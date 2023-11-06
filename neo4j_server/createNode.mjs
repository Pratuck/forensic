import neo4j from 'neo4j-driver'
import dotenv from 'dotenv';

dotenv.config();

async function createLiker(username,profileUrl,reaction,postId){
    const driver = neo4j.driver(process.env.DATABASE_URL, neo4j.auth.basic(process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD))
    const session = driver.session({database:process.env.DATABASE})
    try{
        const result = await session.run(
            `MATCH (p:Post {postId:$postId})
            MERGE (Liker:Account {username: $username,profileUrl: $profileUrl})  
            MERGE (Liker)-[:LIKED {type: $reaction}]->(p)`
            ,
            { "username":username, "profileUrl":profileUrl, "reaction":reaction, "postId":postId}
          )
        console.log(result)

    }catch (err){
        return err
    }
    finally{
        await session.close()
    }
    await driver.close()
  }

async function createPosterAccount(username,profileUrl,postsList){
    const driver = neo4j.driver(process.env.DATABASE_URL, neo4j.auth.basic(process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD))
    const session = driver.session({database:process.env.DATABASE})
    try{
        const result = await session.run(
            `WITH $postsList as postsList
            MATCH (p:Post)
            WHERE p.postId IN postsList
            MERGE (Poster:Account {username: $username, profileUrl: $profileUrl})
            WITH Poster, COLLECT(p) as posts
            FOREACH (post IN posts |
                MERGE (Poster)-[:POSTED]->(post)
            )`
            ,
            { "username":username, "profileUrl":profileUrl,"postsList":postsList}
          )
        console.log(result)

    }catch (err){
        return err
    }
    finally{
        await session.close()
    }
    await driver.close()
  }

async function returnAll(cypher){
    const driver = neo4j.driver(process.env.DATABASE_URL, neo4j.auth.basic(process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD))
    const session = driver.session({database:process.env.DATABASE})
    try{
        const result = await session.run(
            `${cypher}`
          )
        const records=result.records
        console.log(records)

    }catch (err){
        return err
    }
    finally{
        await session.close()
    }
    await driver.close()
  }

 export default (createLiker, createPosterAccount,returnAll)