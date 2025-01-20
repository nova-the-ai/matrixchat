import React, { useState } from 'react';
import ChatRoom from 'ChatRoom';
import axios from 'axios';

const App = () => {
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    // Simulate login
    setUserId('user123');
    setLoggedIn(true);
  };

  const generateCode = async () => {
    const { data } = await axios.post('http://localhost:3000/generate-code', { token: 'your-token' });
    setCode(data.code);
  };

  if (!loggedIn) return <button onClick={handleLogin}>Log In</button>;

  return (
    <div>
      {code ? (
        <ChatRoom code={code} userId={userId} />
      ) : (
        <button onClick={generateCode}>Generate Chat Code</button>
      )}
    </div>
  );
};

export default App;
