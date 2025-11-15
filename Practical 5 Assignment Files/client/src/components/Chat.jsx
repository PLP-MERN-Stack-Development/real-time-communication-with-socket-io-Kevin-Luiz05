import React, { useState, useEffect } from "react";
import socket from "../socket/socket";

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (user) => {
      setTypingUsers([user]);
      setTimeout(() => setTypingUsers([]), 1000);
    });

    socket.on("onlineUsers", (users) => {
      console.log("Online Users:", users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("onlineUsers");
    };
  }, []);

  const sendMessage = () => {
    if (!input) return;
    const message = { text: input, user: username };
    setMessages((prev) => [...prev, message]);
    socket.emit("sendMessage", message);
    setInput("");
  };

  const handleTyping = () => {
    socket.emit("typing", username);
  };

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">Chat Room</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
        {typingUsers.length > 0 && <i>{typingUsers[0]} is typing...</i>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleTyping}
        className="border p-1 mr-2 w-3/4"
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-1 rounded">
        Send
      </button>
    </div>
  );
};

export default Chat;
