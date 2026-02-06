import react, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { connection } from '../../Services/ChatService'


function VideoPlayer({ roomId }: { roomId: string })
{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);


    const sendPlay = () => {
    connection.invoke("StartVideo", roomId, 0);
};

    useEffect(() => {
        const onStart = () => {
            console.log("🔥 ODEBRAŁEM StartVideo");
            setIsPlaying(true);
        };

        connection.on("StartVideo", onStart);

        return () => {
            connection.off("StartVideo", onStart);
        };
    }, []);

    return (
        <>
       <ReactPlayer
       src='https://www.youtube.com/watch?v=zh8zAmeWG10&list=RDFanedv0lMCE&index=2'
       playing = {isPlaying}
       muted
       controls = {true}
       ></ReactPlayer>
       <button onClick={sendPlay}>PLAY</button>

       </>
    )
    
}

export default VideoPlayer
