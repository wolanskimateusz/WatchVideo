import react, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { connection } from '../../Services/ChatService'


function VideoPlayer({ roomId }: { roomId: string })
{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const playerRef = useRef<any>(null)
    const [videoURL, setVideoURL] = useState<string> ("")

    const sendPlay = () => {
    connection.invoke("StartVideo", roomId);
    };

    const sendPause = () => {
    connection.invoke("PauseVideo", roomId);
    };

    useEffect(() => {

        

        const onStart = () => {
            console.log("🔥 ODEBRAŁEM StartVideo");
            playerRef.current.api.seekTo(0)
            setIsPlaying(true);
           
        };
         const onPause = () => {
            console.log("🔥 ODEBRAŁEM PauseVideo");
            setIsPlaying(false);
           
        console.log(playerRef.current.api.getCurrentTime())
        console.log(playerRef)
            
           
        };

        connection.on("StartVideo", onStart);
        connection.on("PauseVideo", onPause)

        return () => {
            connection.off("StartVideo", onStart);
            connection.off("PauseVideo", onPause)
        };
    }, []);

    return (
        <>
       <input
            type="text"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="Wpisz tekst"
            />
       <ReactPlayer
        ref={playerRef}
       src='https://www.youtube.com/watch?v=XCGqOTX6g8s&list=RDXCGqOTX6g8s'
       playing = {isPlaying}
      config={{
        youtube: {
        color: 'white',
        },
    }}
        
       ></ReactPlayer>

       <button onClick={sendPlay}>PLAY</button>
       <button onClick={sendPause}>PAUSE</button>

       </>
    )
    
}

export default VideoPlayer
