import { useEffect, useState } from "react";
import { connection } from "../../Services/ChatService";

function Chat()
{
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

  useEffect(() => {
     if (connection.state === "Disconnected") {
      connection.start()
        .then(() => console.log("✅ Connected to SignalR"))
        .catch(console.error);
    }

    connection.on("ReceiveMessage", (user, message) => {
      setMessages(prev => [...prev, `${user}: ${message}`]);
    });

    return () => {
      connection.off("ReceiveMessage");
    };
  }, []);

  const sendMessage = () => {
    connection.invoke("SendMessage", "User1", input)
      .catch(console.error);
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => <div key={i}>{m}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat