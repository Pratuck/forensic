import React, { useState } from "react";
import neo4j from 'neo4j-driver';

function Report(){
    const [result,setResult]=useState('')
    async function submitHandler(){
        
        setResult("hi")
    }
    return (
        <div>
        <h3>Click on the button to genearet a report</h3>
        <form>
            <button value="submit" onClick={submitHandler}>Generate</button>
        </form>
        <h1>{result}</h1>
        </div>
    )

}
export default Report