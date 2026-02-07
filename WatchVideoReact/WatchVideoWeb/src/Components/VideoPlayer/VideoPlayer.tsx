import react, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { connection } from '../../Services/ChatService'


function VideoPlayer({ roomId }: { roomId: string })
{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const playerRef = useRef<any | null>(null);


    const sendPlay = () => {
    connection.invoke("StartVideo", roomId, 0);
    };

    const sendPause = () => {
    connection.invoke("PauseVideo", roomId);
    };

    useEffect(() => {
        const onStart = () => {
            console.log("🔥 ODEBRAŁEM StartVideo");
            playerRef.current?.getInternalPlayer()?.playVideo?.();
            setIsPlaying(true);
            setIsMuted(false);
        };
         const onPause = () => {
            console.log("🔥 ODEBRAŁEM PauseVideo");
            playerRef.current?.getInternalPlayer()?.pauseVideo?.();
            setIsPlaying(false);
            setIsMuted(true);
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
       <ReactPlayer
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
