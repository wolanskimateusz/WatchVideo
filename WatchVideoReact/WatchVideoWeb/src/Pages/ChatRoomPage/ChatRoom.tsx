import { useParams } from "react-router-dom"
import Chat from "../../Components/Chat/Chat"
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";


interface ChatRoomData{
    id : number
    urlEndPoint : string
}

function ChatRoom ()
{
    
    const {url} = useParams();

    const [room, setRoom] = useState<ChatRoomData | null>();

    useEffect(() => {
        const getRoomByUrl = async () => {
            try {
                const response = await axios.get<ChatRoomData>(`${API_URL}/api/chatroom/${url}`);
                setRoom(response.data);
                console.log(response.data);
            }
             catch (e) {
                console.error("Nie znaleziono pokoju", e);
                setRoom(null);
            }}
            getRoomByUrl();
    },[url])

   return (
  <>
    <h1 className="mb-3">Pokój: {room?.urlEndPoint}</h1>

        <div className="container-fluid w-100 ">
        <div className="row" style={{ height: "80vh" }}>
            {/* VIDEO */}
            <div className="col-8 h-100">
            <div className="h-100 rounded">
                <VideoPlayer />
            </div>
            </div>

            {/* CHAT */}
            <div className="col-4 h-100 ">
            <div className="h-100 ps-3">
                {room && <Chat roomId={room.urlEndPoint} />}
            </div>
            </div>
        </div>
        </div>
  </>
)

}

export default ChatRoom