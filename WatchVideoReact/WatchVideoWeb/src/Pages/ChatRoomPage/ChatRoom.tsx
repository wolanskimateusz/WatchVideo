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

interface UserDto {
  userName: string;
}

interface RoomUsersDto {
  roomId: string;
  users: UserDto[];
}


function ChatRoom ()
{
    
    const {url} = useParams();
    const [room, setRoom] = useState<ChatRoomData | null>();
    const [userName, setUserName] = useState<string>("User1");
    const [showModal, setShowModal] = useState(false);
    const [tempName, setTempName] = useState("");
    const [users, setUsers] = useState<UserDto[]>([]);


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
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      setShowModal(true);
    }
  }, []);

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

    const onUsersUpdated = (dto: RoomUsersDto) => {
      if (dto.roomId === room?.urlEndPoint) {
        setUsers(dto.users);
      }
    };
    connection.on("RoomUsersUpdated", onUsersUpdated);

    return () => {
      if (connection.state === "Connected")
        connection.invoke("LeaveRoom", room.urlEndPoint, userName);
      connection.off("ReceiveMessage");
      connection.off("RoomUsersUpdated", onUsersUpdated);
    };
  }, [room?.urlEndPoint, userName]);


   const handleSetName = () => {
    if (!tempName.trim()) return;
    localStorage.setItem("userName", tempName.trim());
    setUserName(tempName.trim());
    setShowModal(false);
  };

   return (
  <>
    <h1 className="mb-3">Pokój: {room?.urlEndPoint}</h1>
    {/* USERS LIST */}
    <div className="mb-3 p-2 border rounded bg-light">
      <h6 className="mb-2">Użytkownicy w pokoju</h6>

      {users.length === 0 ? (
        <small className="text-muted">Brak użytkowników</small>
      ) : (
        <ul className="list-group list-group-flush">
        {users.map(u => (
          <li
            key={u.userName} 
            className={`list-group-item px-1 py-1 ${
              u.userName === userName ? "fw-bold text-primary" : ""
            }`}
          >
            {u.userName}
          </li>
        ))}
</ul>
      )}
    </div>
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
                {room && <Chat roomId={room.urlEndPoint} userName={userName} setUserName={setUserName}/>}
                </SignalRContext.Provider>
            </div>
            </div>
        </div>
        </div>

       {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Wpisz swoją nazwę użytkownika</h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Twój nick"
                  onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary w-100" onClick={handleSetName}>
                  Zatwierdź
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </>
)

}

export default ChatRoom