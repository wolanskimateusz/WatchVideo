import { useParams } from "react-router-dom"
import Chat from "../../Components/Chat/Chat"
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import { connection } from "../../Services/ChatService";
import { SignalRContext } from "../../SignalRContext";


interface ChatRoomData{
    id : string
    urlEndPoint : string
}


function ChatRoom ()
{
    
    const {url} = useParams();
    const [room, setRoom] = useState<ChatRoomData | null>();
    const [userName, setUserName] = useState("User1");


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


    useEffect(() => {
    if (!room) return;
    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log(" Connected to SignalR");
        }


        if (connection.state === "Connected") {
          await connection.invoke("JoinRoom", room.urlEndPoint, userName);
          console.log(`Połączono do pokoju ${room?.id}`);
        }
      } catch (err) {
        console.error(" Błąd połączenia:", err);
      }
    };

    startConnection();

    return () => {
      if (connection.state === "Connected")
        connection.invoke("LeaveRoom", room.urlEndPoint, userName);
      connection.off("ReceiveMessage");
    };
  }, [room?.urlEndPoint, userName]);

   return (
  <>
    <h1 className="mb-3">Pokój: {room?.urlEndPoint}</h1>

        <div className="container-fluid w-100 ">
        <div className="row" style={{ height: "80vh" }}>
            {/* VIDEO */}
            <div className="col-8 h-100">
            <div className="h-100 rounded">
              <SignalRContext.Provider value={connection}>
                 {room && <VideoPlayer roomId={room.urlEndPoint} userName={userName}/>}
              </SignalRContext.Provider>
            </div>
            </div>

            {/* CHAT */}
            <div className="col-4 h-100 ">
            <div className="h-100 ps-3">
                <SignalRContext.Provider value={connection}>
                {room && <Chat roomId={room.urlEndPoint} userName={userName} />}
                </SignalRContext.Provider>
            </div>
            </div>
        </div>
        </div>
  </>
)

}

export default ChatRoom