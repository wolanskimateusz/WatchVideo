import { useEffect, useState, useRef } from "react";
import { useSignalR } from "../../SignalRContext";
import "./Chat.css";

interface Message {
  userName?: string;
  message: string;
  type: "user" | "system";
}

function Chat({ roomId, userName, setUserName }: { roomId: string , userName: string, setUserName : (name: string) => void}) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tempName, setTempName] = useState(userName);
  
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
    <div className="d-flex flex-column h-100 bg-dark">
        <div className="p-3 flex-grow-1 d-flex flex-column gap-3 overflow-hidden">

            {/* Zmiana nicku */}
            <div className="bg-secondary bg-opacity-10 p-2 rounded">
                <div className="input-group input-group-sm">
                    <input
                        className="form-control bg-dark text-light border-secondary"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Twój nick"
                    />
                    <button className="btn btn-outline-info" onClick={() => {
                        setUserName(tempName.trim());
                        localStorage.setItem("userName", tempName.trim());
                    }}>Change</button>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-grow-1 overflow-auto border border-secondary rounded p-2 bg-black bg-opacity-25 shadow-inner">
                {messages.map((m, i) => (
                    <div key={i} className={`mb-2 small ${m.type === 'system' ? 'text-center' : ''}`}>
                        {m.type === "user" ? (
                            <div>
                                <span className="fw-bold text-info">{m.userName}:</span>
                                <span className="ms-2 text-light">{m.message}</span>
                            </div>
                        ) : (
                            <span className="text-secondary fst-italic" style={{fontSize: '0.8rem'}}>
                                — {m.message} —
                            </span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Wysyłanie */}
            <div className="input-group">
                <input
                    className="form-control bg-dark text-light border-secondary"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Napisz..."
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                    <i className="bi bi-send"></i>
                </button>
            </div>
        </div>
    </div>
);
}

export default Chat;
