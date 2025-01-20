import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatRoom = ({ code, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join-room', { code, userId });

    socket.on('receive-message', ({ encryptedMessage }) => {
      // Decrypt message here before showing it
      setMessages((prev) => [...prev, encryptedMessage]);
    });

    return () => socket.disconnect();
  }, [code, userId]);

  const sendMessage = () => {
    // Encrypt the message here
    const encryptedMessage = message; // Replace with actual encryption
    socket.emit('send-message', { code, encryptedMessage });
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Room: {code}</h2>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
