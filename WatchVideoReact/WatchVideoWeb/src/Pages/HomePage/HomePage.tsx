import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL} from "/src/config/api";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Userx1");
  const [rooms, setRooms] = useState<any[]>([]);
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<string[]>(
          `${API_URL}/api/chatroom`
        );
        setRooms(response.data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/chatroom`
      );
      setCreatedRoom(response.data);
      navigate("/room/" + response.data.urlEndPoint);
    } catch (err) {
      console.error("Error creating room", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Lista pokoi:</h2>
        {rooms.map((room, i) => (
          <div key={room.id} className="border p-2 rounded bg-gray-100">
            {room.urlEndPoint}
            <button
              onClick={() => navigate("/room/" + room.urlEndPoint)}
            > 
              Join
            </button>
          </div>
        ))}
      </div>

      <div>
        <p>Twoja nazwa: {userName}</p>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-1"
        />
      </div>

      <button
        onClick={createRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Room
      </button>
    </div>
  );
}