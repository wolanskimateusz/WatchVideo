import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL} from "../../config/api";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User1");
  const [rooms, setRooms] = useState<any[]>([]);
  const [createdRoom, setCreatedRoom] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<string[]>(`${API_URL}/api/chatroom`);
        setRooms(response.data);
        console.log("odebrane z api: ",response.data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };
    fetchRooms();
    const user = localStorage.getItem("userName")
    if(user) setUserName(user)
  }, []);

  const createRoom = async (roomName : string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/chatroom`, {roomName : roomName}
      );
      setCreatedRoom(response.data);
      navigate("/room/" + response.data.urlEndPoint);
    } catch (err) {
      console.error("Error creating room", err);
    }
  };

    const handleCreateRoom = () => {
      if (!newRoomName.trim()) return;
      createRoom(newRoomName.trim());
      setShowModal(false);
      setNewRoomName("");
    };
  

 return (
  <div className="container py-4">
    <div className="mb-4">
      <label className="form-label fw-bold">Your name:</label>
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="form-control mb-3"
        placeholder="Wpisz nick"
      />
    </div>

    <h2 className="mb-3">Room list:</h2>
    <div className="list-group mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
      {rooms.map((room) => (
        <div
          key={room.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>{room.urlEndPoint}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              localStorage.setItem("userName", userName);
              navigate("/room/" + room.urlEndPoint);
            }}
          >
            Join
          </button>
        </div>
      ))}
      {rooms.length === 0 && (
        <div className="text-muted p-2">No rooms available, create new one!</div>
      )}
    </div>

   <button
        className="btn btn-success"
        onClick={() => setShowModal(true)}
      >
        Create Room
      </button>

      {/* Modal do tworzenia pokoju */}
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
                <h5 className="modal-title">Create room</h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Your Room Name"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateRoom}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
