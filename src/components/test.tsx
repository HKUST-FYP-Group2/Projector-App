import React, { useState } from "react";
import useWebSocket from "./useWebSocket";

const Test: React.FC = () => {
  const { messages, isConnected, sendMessage } = useWebSocket();
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <div>
      <h1>WebSocket Connection</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send
      </button>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Test;
