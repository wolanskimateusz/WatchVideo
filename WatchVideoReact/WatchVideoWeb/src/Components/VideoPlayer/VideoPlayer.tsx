import react, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { connection } from '../../Services/ChatService'


function VideoPlayer({ roomId, userName }: { roomId: string, userName: string })
{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const playerRef = useRef<any>(null)
    const [videoURL, setVideoURL] = useState<string> ()
    const [currTime, setCurrTime] = useState<number>()
    const [videoTitle, setVideoTitle] = useState<string>()

    const isLocalChangeRef = useRef(false);


    const sendPlay = () => {
    connection.invoke("StartVideo", roomId, currTime);
    };

    const sendPause = () => {
    connection.invoke("PauseVideo", roomId);
    };

    const sendCurrentTime = (time: number) => {
    connection.invoke("UpdateCurrTime", roomId, time);

    };


    useEffect(() => {

        const onSyncRoomState = (url: string, time: number, playing: boolean) => {
            isLocalChangeRef.current = false;
            setVideoURL(url);  
            setCurrTime(time);                  
            setIsPlaying(playing)
        };


        const onStart = (time : number) => {
            console.log("ODEBRAŁEM StartVideo");
            playerRef.current.api.seekTo(time)
            setIsPlaying(true);
           
        };
         const onPause = () => {
            console.log("ODEBRAŁEM PauseVideo");
            setIsPlaying(false);
            const time = playerRef.current.api.getCurrentTime()
            setCurrTime(time)
            sendCurrentTime(time)
           
        console.log(playerRef)
            
        };

        const onVideoChange = (url:string) => {
            isLocalChangeRef.current = false;
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

    useEffect(() => {
        if (!videoTitle || !videoURL) return;
        if (!isLocalChangeRef.current) return;

        connection.invoke(
            "ChangeVideo",
            roomId,
            videoURL,
            userName,
            videoTitle
        );
        }, [videoTitle]);

    return (
        <>
       <input
            value={videoURL}
            onChange={(e) => {
                isLocalChangeRef.current = true;
                setVideoURL(e.target.value);
                setVideoTitle(""); 
            }}
            placeholder='Video link here'
            />

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
            const title = playerRef.current.api.videoTitle;
            if (title) setVideoTitle(title);
        }}
        onTimeUpdate={() => {
            const time = playerRef.current.api.getCurrentTime()
            setCurrTime(time)
            sendCurrentTime(time)
        }} 
       ></ReactPlayer>
       

       <button onClick={sendPlay}>PLAY</button>
       <button onClick={sendPause}>PAUSE</button>
       

       </>
    )
    
}

export default VideoPlayer
