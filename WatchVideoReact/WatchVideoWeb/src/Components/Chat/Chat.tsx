import { useEffect, useState, useRef } from "react";
import { useSignalR } from "../../SignalRContext";
import "./Chat.css";

interface Message {
  userName: string;
  message: string;
}

function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("User1");

  const connection = useSignalR();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subskrypcja odbioru wiadomości
  useEffect(() => {
    if (!connection) return;

    const handleMessage = (user: string, message: string) => {
      setMessages(prev => [...prev, { userName: user, message }]);
    };

    connection.on("ReceiveMessage", handleMessage);

    return () => {
      connection.off("ReceiveMessage", handleMessage);
    };
  }, [connection]);

  // Wyślij wiadomość
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await connection.invoke("SendMessageToRoom", roomId, userName, input);
      setInput("");
    } catch (err) {
      console.error("❌ Błąd wysyłania:", err);
    }
  };

  // Auto-scroll
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
            if (e.key === "Enter" && input.trim()) {
              sendMessage();
              e.preventDefault();
            }
          }}
          placeholder="Napisz wiadomość..."
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}

export default Chat;
