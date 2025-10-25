import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("line 15", socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSend1 = (e) => {
    e.preventDefault();
    if (socket && message1.trim()) {
      socket.emit("send-message", { sender: "sender1", text: message1 });
      setMessage1("");
    }
  };

  const handleSend2 = (e) => {
    e.preventDefault();
    if (socket && message2.trim()) {
      socket.emit("send-message", { sender: "sender2", text: message2 });
      setMessage2("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Two User Chat Demo</h2>
      {socket?.id && <p>Socket ID: {socket.id}</p>}

      {/* Chat window */}
      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "sender1" ? "flex-end" : "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                background: msg.sender === "sender1" ? "#4CAF50" : "#2196F3",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "60%",
              }}
            >
              <strong>{msg.sender === "sender1" ? "You" : "Other"}:</strong>{" "}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Sender 1 */}
      <form onSubmit={handleSend1} style={{ marginTop: "10px" }}>
        <h4>Sender 1</h4>
        <input
          value={message1}
          onChange={(e) => setMessage1(e.target.value)}
          placeholder="Type message"
        />
        <button type="submit">Send as Sender 1</button>
      </form>

      {/* Sender 2 */}
      <form onSubmit={handleSend2} style={{ marginTop: "10px" }}>
        <h4>Sender 2</h4>
        <input
          value={message2}
          onChange={(e) => setMessage2(e.target.value)}
          placeholder="Type message"
        />
        <button type="submit">Send as Sender 2</button>
      </form>
    </div>
  );
};

export default App;
