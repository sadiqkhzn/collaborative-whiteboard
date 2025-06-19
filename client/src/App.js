import React, { useState } from "react";
import Whiteboard from "./components/Whiteboard";
import './App.css';

function App() {
  const [roomId, setRoomId] = useState(null);
  const [inputRoomId, setInputRoomId] = useState("");

  const handleJoin = () => {
    if (inputRoomId.trim()) {
      setRoomId(inputRoomId.trim());
    }
  };

  return (
    <div className="home-page">
      <div style={{ padding: "2rem" }} className="centered-div">
        <h1 style={{ fontFamily: 'Courier New, monospace', fontSize: '36px', color: 'black' }}>Collaborative Whiteboard</h1>
        {!roomId ? (
          <div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem" }}
            />
            <button
              onClick={handleJoin}
              style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}
            >
              Create / Join Room
            </button>
          </div>
        ) : (
          <Whiteboard roomId={roomId} />
        )}
      </div>
    </div>
  );
}

export default App;
