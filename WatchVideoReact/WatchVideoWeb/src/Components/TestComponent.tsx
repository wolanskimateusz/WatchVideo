import React, { useEffect, useState } from 'react'
import axios from "axios";


function TestComponent ()
{

    const [test, setTest] = useState<string | null>(null);
    const [createResponse, setCreateResponse] = useState<any>();
    
    useEffect(()=>{

        const fetchTest = async () => {
            const testResponse = await axios.get<string>("http://localhost:5147/api/video")
            setTest(testResponse.data);
        }
    fetchTest();
    },[])

    

    const createTest = async () => {
            const testResponse = await axios.post("http://localhost:5147/api/chatroom") 
            setCreateResponse(testResponse);      
        }
    
 
  return (
    <div>{test}
    <button onClick={createTest}> Stworz Pokoj</button>
    </div>
    
  )
}


export default TestComponent