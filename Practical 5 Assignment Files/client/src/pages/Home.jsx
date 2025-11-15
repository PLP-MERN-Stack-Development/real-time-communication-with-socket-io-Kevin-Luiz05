import React, { useState } from "react";
import Chat from "../components/Chat";

const Home = () => {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!username) return;
    setJoined(true);
  };

  return (
    <div className="p-4">
      {!joined ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Enter Username:</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-1 mr-2"
          />
          <button onClick={handleJoin} className="bg-green-500 text-white p-1 rounded">
            Join Chat
          </button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
};

export default Home;
