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
    <div className="min-vh-100 w-100 bg-dark text-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">WatchParty</h1>
            </div>
            
            <div className="card bg-dark border-secondary shadow-lg mb-4">
              <div className="card-body p-4">
                <label className="form-label fw-bold text-secondary text-uppercase small">Your Name</label>
                <div className="input-group mb-4 shadow-sm">
                  <span className="input-group-text bg-secondary border-secondary text-light">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Wpisz nick..."
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Room List:</h5>
                  <button
                    className="btn btn-success btn-sm px-3"
                    onClick={() => setShowModal(true)}
                  >
                    + Create room
                  </button>
                </div>

                {/* Lista pokoi */}
                <div 
                  className="list-group list-group-flush border border-secondary rounded shadow-inner" 
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <div
                        key={room.id}
                        className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center p-3"
                      >
                        <div>
                          <div className="fw-bold">{room.name}</div>
                        </div>
                        <button
                          className="btn btn-primary px-4 shadow-sm"
                          onClick={() => {
                            localStorage.setItem("userName", userName);
                            navigate("/room/" + room.urlEndPoint);
                          }}
                        >
                          Join
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="list-group-item bg-dark text-secondary text-center py-5">
                      No rooms available. Create new one!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ciemny Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Create new room</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <label className="form-label text-secondary small">Room name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary form-control-lg"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                  autoFocus
                />
              </div>
              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4"
                  onClick={handleCreateRoom}
                >
                  Create and join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
