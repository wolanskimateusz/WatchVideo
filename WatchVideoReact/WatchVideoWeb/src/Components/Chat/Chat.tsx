import { useEffect, useState, useRef } from "react";
import { connection } from "../../Services/ChatService";
import "./Chat.css";

interface Message {
  userName: string;
  message: string;
}

function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("User1");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

        if (connection.state === "Connected") {
          await connection.invoke("JoinRoom", roomId, userName);
          console.log(`Połączono do pokoju ${roomId}`);
        }
      } catch (err) {
        console.error("❌ Błąd połączenia:", err);
      }
    };

    startConnection();

    return () => {
      if (connection.state === "Connected")
        connection.invoke("LeaveRoom", roomId, userName);
      connection.off("ReceiveMessage");
    };
  }, [roomId, userName]);

  const sendMessage = async () => {
    if (!connected || !input.trim()) return;
    try {
      await connection.invoke("SendMessageToRoom", roomId, userName, input);
      setInput("");
    } catch (err) {
      console.error("❌ Błąd wysyłania:", err);
    }
  };

  // auto-scroll po każdej zmianie messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border rounded p-3 h-100 d-flex flex-column">
      {/* Username */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Twoja nazwa:</label>
        <input
          className="form-control"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Wpisz nick"
        />
      </div>

      {/* Messages */}
      <div className="chat-messages border rounded p-2 mb-3 flex-grow-1 overflow-auto d-flex flex-column">
        {messages.map((m, i) => (
          <div key={i} className="mb-1 chat-message">
            <span className="chat-username">{m.userName}:</span>{" "}
            <span className="chat-text">{m.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + button */}
      <div className="input-group">
        <input
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && input.trim() && connected) {
              sendMessage();
              e.preventDefault();
            }
          }}
          placeholder="Napisz wiadomość..."
          disabled={!connected}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
        >
          Wyślij
        </button>
      </div>

      {!connected && (
        <div className="text-muted mt-2 small">Łączenie z serwerem...</div>
      )}
    </div>
  );
}

export default Chat;
