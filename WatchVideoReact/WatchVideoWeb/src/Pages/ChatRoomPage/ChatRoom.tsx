import { useParams } from "react-router-dom";
import Chat from "../../Components/Chat/Chat";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import { connection } from "../../Services/ChatService";
import { SignalRContext } from "../../SignalRContext";

interface ChatRoomData {
  id: string;
  urlEndPoint: string;
  name: string;
}

interface UserDto {
  userName: string;
}

interface RoomUsersDto {
  roomId: string;
  users: UserDto[];
}

function ChatRoom() {
  const { url } = useParams();
  const [room, setRoom] = useState<ChatRoomData | null>();
  const [userName, setUserName] = useState<string>("User1");
  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [users, setUsers] = useState<UserDto[]>([]);

  // Pobranie pokoju po URL
  useEffect(() => {
    const getRoomByUrl = async () => {
      try {
        const response = await axios.get<ChatRoomData>(`${API_URL}/api/chatroom/${url}`);
        setRoom(response.data);
      } catch (e) {
        console.error("Nie znaleziono pokoju", e);
        setRoom(null);
      }
    };
    getRoomByUrl();
  }, [url]);

  // Sprawdzenie zapisanej nazwy użytkownika
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      setShowModal(true);
    }
  }, []);

  // Połączenie SignalR
  useEffect(() => {
    if (!room) return;

    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") await connection.start();

        if (connection.state === "Connected") {
          await connection.invoke("JoinRoom", room.urlEndPoint, userName);
        }
      } catch (err) {
        console.error("Błąd połączenia:", err);
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
    <div className="vh-100 w-100 bg-dark text-light d-flex flex-column overflow-hidden">
      {/* Header - Cieńszy i bardziej elegancki */}
      <header className="p-3 border-bottom border-secondary bg-dark d-flex justify-content-between align-items-center">
        <h3 className="mb-0 text-primary fw-bold">{room?.name || "WatchParty"}</h3>
        <div className="badge bg-secondary">Room ID: {url}</div>
      </header>

      {/* Main Content Area */}
      <div className="container-fluid flex-grow-1 overflow-hidden">
        <div className="row h-100">
          
          {/* Lewa kolumna: Video (75-80% szerokości) */}
          <main className="col-lg-9 col-md-8 p-3 h-100 overflow-auto">
            <SignalRContext.Provider value={connection}>
              {room && <VideoPlayer roomId={room.urlEndPoint} userName={userName} />}
            </SignalRContext.Provider>
          </main>

          {/* Prawa kolumna: Sidebar (Użytkownicy + Chat) */}
          <aside className="col-lg-3 col-md-4 border-start border-secondary p-0 bg-dark d-flex flex-column h-100">
            
            {/* Lista użytkowników wewnątrz sidebaru */}
            <div className="p-3 border-bottom border-secondary" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <small className="text-uppercase fw-bold text-secondary mb-2 d-block">Users online</small>
              <div className="d-flex flex-wrap gap-2">
                {users.map(u => (
                  <span key={u.userName} className={`badge ${u.userName === userName ? 'bg-primary' : 'bg-outline-secondary border'}`}>
                    {u.userName}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat zajmuje resztę wysokości sidebaru */}
            <div className="flex-grow-1 overflow-hidden">
              <SignalRContext.Provider value={connection}>
                {room && (
                  <Chat
                    roomId={room.urlEndPoint}
                    userName={userName}
                    setUserName={setUserName}
                  />
                )}
              </SignalRContext.Provider>
            </div>
          </aside>

        </div>
      </div>

      {/* Modal ustawienia nicku */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header bg-dark text-light">
                <h5 className="modal-title">Your username</h5>
              </div>
              <div className="modal-body bg-dark">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Twój nick"
                  onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                  autoFocus
                />
              </div>
              <div className="modal-footer bg-dark">
                <button className="btn btn-primary w-100" onClick={handleSetName}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
