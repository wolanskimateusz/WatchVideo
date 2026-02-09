import { useEffect, useState, useRef } from "react";
import { useSignalR } from "../../SignalRContext";
import "./Chat.css";

interface Message {
  userName?: string;
  message: string;
  type: "user" | "system";
}

function Chat({ roomId, userName }: { roomId: string , userName: string}) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  const connection = useSignalR();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connection) return;

    const handleMessage = (user: string, message: string) => {
      setMessages((prev) => [
        ...prev,
        { userName: user, message, type: "user" },
      ]);
    };

    const handleSystemMessage = (message: string) => {
      setMessages((prev) => [...prev, { message, type: "system" }]);
    };

    connection.on("ReceiveMessage", handleMessage);
    connection.on("ReceiveSystemMessage", handleSystemMessage);

    return () => {
      connection.off("ReceiveMessage", handleMessage);
      connection.off("ReceiveSystemMessage", handleSystemMessage);
    };
  }, [connection]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await connection.invoke("SendMessageToRoom", roomId, userName, input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border rounded p-3 h-100 d-flex flex-column">
      
      {/* Messages */}
      <div className="chat-messages border rounded p-2 mb-3 flex-grow-1 overflow-auto d-flex flex-column">
        {messages.map((m, i) => (
          <div key={i} className={`mb-1 chat-message ${m.type}`}>
            {m.type === "user" ? (
              <>
                <span className="chat-username">{m.userName}:</span>{" "}
                <span className="chat-text">{m.message}</span>
              </>
            ) : (
              <span className="chat-system">{m.message}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-group">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Wyślij
        </button>
      </div>
    </div>
  );
}

export default Chat;
