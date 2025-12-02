import React, { useEffect, useState } from 'react'
import axios from "axios";


function TestComponent ()
{

    const [test, setTest] = useState<string | null>(null);

    
    useEffect(()=>{

        const fetchTest = async () => {
            const testResponse = await axios.get<string>("http://localhost:5147/api/video")
            setTest(testResponse.data);
        }
    fetchTest();
    },[])
 
  return (
    <div>{test}</div>
  )
}


export default TestComponent