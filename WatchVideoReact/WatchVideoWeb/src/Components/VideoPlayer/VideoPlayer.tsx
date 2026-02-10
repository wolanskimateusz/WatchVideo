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
    <div className="h-100 d-flex flex-column gap-3">
        {/* Input linku - teraz na pełną szerokość dostępnej kolumny */}
        <div className="input-group shadow-sm">
            <span className="input-group-text bg-secondary border-secondary text-light">URL</span>
            <input
                className="form-control bg-dark text-light border-secondary"
                value={videoURL}
                onChange={(e) => {
                    isLocalChangeRef.current = true;
                    setVideoURL(e.target.value);
                    setVideoTitle(""); 
                }}
                placeholder="Wklej link z YouTube..."
            />
        </div>

        {/* Video Frame */}
        <div className="card-body p-0 bg-black d-flex align-items-center justify-content-center overflow-hidden" style={{ position: 'relative', flex: 1 }}>
                <div style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
                <ReactPlayer
                    ref={playerRef}
                    src={videoURL} 
                    playing={isPlaying}
                    width="100%"
                    height="100%"
                    controls={true}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    onReady={() => {
                    const title = playerRef.current?.getInternalPlayer()?.getVideoData?.()?.title;
                    if (title) setVideoTitle(title);
                    }}
                />
                </div>
         </div>
            
            {/* Przyciski pod wideo */}
            <div className="card-footer bg-dark border-secondary d-flex justify-content-center gap-3 p-3 flex-shrink-0">
                <button className="btn btn-lg btn-success px-5" onClick={sendPlay}>
                    <i className="bi bi-play-fill"></i> Play
                </button>
                <button className="btn btn-lg btn-danger px-5" onClick={sendPause}>
                    <i className="bi bi-pause-fill"></i> Pause
                </button>
            </div>
    </div>
);
    
}

export default VideoPlayer
