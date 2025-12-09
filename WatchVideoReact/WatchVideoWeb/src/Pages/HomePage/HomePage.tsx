import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Userx1");
  const [rooms, setRooms] = useState<string[]>([]);
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<string[]>(
          "http://localhost:5147/api/chatroom"
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
        "http://localhost:5147/api/chatroom"
      );
      setCreatedRoom(response.data);
    } catch (err) {
      console.error("Error creating room", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Lista pokoi:</h2>
        {rooms.map((room, i) => (
          <div key={i} className="border p-2 rounded bg-gray-100">
            {room}
            <button
              onClick={() => navigate("/room/" + room)}
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