import react, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { connection } from '../../Services/ChatService'


function VideoPlayer({ roomId }: { roomId: string })
{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const playerRef = useRef<any>(null)
    const [videoURL, setVideoURL] = useState<string> ()
    const [currTime, setCurrTime] = useState<number>()
    const [pendingSeek, setPendingSeek] = useState<number | null>(null);


    const sendPlay = () => {
    connection.invoke("StartVideo", roomId, currTime);
    };

    const sendPause = () => {
    connection.invoke("PauseVideo", roomId);
    };

    const sendChangeVideo = () => {
    connection.invoke("ChangeVideo", roomId, videoURL);
    };

    const sendCurrentTime = (time: number) => {
    connection.invoke("UpdateCurrTime", roomId, time);
    console.log("Sending currTime", time, "roomId=", roomId);

    };


    useEffect(() => {

        const onSyncRoomState = (url: string, time: number, playing: boolean) => {
            setVideoURL(url);  
            setCurrTime(time);           
            setPendingSeek(time);        
            setIsPlaying(playing)
        };


        const onStart = (time : number) => {
            console.log("🔥 ODEBRAŁEM StartVideo");
            playerRef.current.api.seekTo(time)
            setIsPlaying(true);
           
        };
         const onPause = () => {
            console.log("🔥 ODEBRAŁEM PauseVideo");
            setIsPlaying(false);
            const time = playerRef.current.api.getCurrentTime()
            setCurrTime(time)
            sendCurrentTime(time)
           
        console.log(playerRef)
            
        };

        const onVideoChange = (url:string) => {
            setVideoURL(url)
            setIsPlaying(false);
            console.log("nowe video", playerRef.current.api.videoTitle)
        };

        connection.on("StartVideo", onStart)
        connection.on("PauseVideo", onPause)
        connection.on("VideoChange", onVideoChange)
        connection.on("SyncRoomState", onSyncRoomState)

        return () => {
            connection.off("StartVideo", onStart)
            connection.off("PauseVideo", onPause)
            connection.off("VideoChange", onVideoChange)
            connection.off("SyncRoomState", onSyncRoomState)
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
            <button onClick={sendChangeVideo}>CHANGE VIDEO</button>
       <ReactPlayer
        ref={playerRef}
       src={videoURL}
       playing = {isPlaying}
      config={{
        youtube: {
        color: 'white',
        },
    }}
      onReady={() => {
            if (pendingSeek !== null && playerRef.current) {
                playerRef.current.api.seekTo(pendingSeek);
                setPendingSeek(null);
            }
        }}
        
       ></ReactPlayer>

       <button onClick={sendPlay}>PLAY</button>
       <button onClick={sendPause}>PAUSE</button>
       

       </>
    )
    
}

export default VideoPlayer
