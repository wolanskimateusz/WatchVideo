import { useEffect, useState } from "react";
import { connection } from "../../Services/ChatService";

interface Message {
  userName: string;
  message: string;
}

function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("User1");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log("✅ Connected to SignalR");
        }

        setConnected(true);

        connection.off("ReceiveMessage");

        connection.on("ReceiveMessage", (userName: string, message: string) => {
          setMessages(prev => [...prev, { userName, message }]);
        });

       if(connection.state === "Connected") {
          await connection.invoke("JoinRoom", roomId, userName);
          console.log(`Polaczono do pokoju  ${roomId}`)
       }
      

      } catch (err) {
        console.error("❌ Błąd połączenia:", err);
      }
    };

    startConnection();

    return () => {
      if(connection.state === "Connected") connection.invoke("LeaveRoom", roomId, userName);
      connection.off("ReceiveMessage");
      
    };
  }, []);

  const sendMessage = async () => {
    if (!connected || !input.trim()) return;

    try {
     await connection.invoke("SendMessageToRoom", roomId,userName,input );
      setInput("");
    } catch (err) {
      console.error("❌ Błąd wysyłania:", err);
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "1rem" }}>
      <p>
        Twoja nazwa:
        <input
          value={userName}
          onChange={e => setUserName(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </p>

      <div style={{ border: "1px solid black", padding: "0.5rem", minHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.userName}:</strong> {m.message}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Napisz wiadomość..."
        style={{ width: "70%", marginRight: "0.5rem" }}
        disabled={!connected}
      />

      <button onClick={sendMessage} disabled={!connected || !input.trim()}>
        Wyślij
      </button>

      {!connected && <p>Łączenie z serwerem...</p>}
    </div>
  );
}

export default Chat;
