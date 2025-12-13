import { useParams } from "react-router-dom"
import Chat from "../../Components/Chat/Chat"
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";


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

    return <>
    <h1>Pokoj: {room?.urlEndPoint}</h1>
    {room && <Chat roomId={room.urlEndPoint} />}
    </>
}

export default ChatRoom