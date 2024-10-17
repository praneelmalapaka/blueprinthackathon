// Messages.js (React frontend)
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../AuthContext'; 

function Messages() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
        const fetchMessages = async () => {
                if (user) {  // Check if user and user.id are defined
                        const user_id = user.id
                  try {
                    const response = await fetch(`http://localhost:5001/api/messages/${user_id}`);
                    if (response.ok) {
                      const data = await response.json();
                      setMessages(data);
                    } else {
                      // Handle error, e.g., display an error message
                      console.error('Failed to fetch messages:', response.status, response.statusText);
                    }
                  } catch (error) {
                    console.error('Error fetching messages:', error);
                  }
                }
              };

    fetchMessages();
  }, [user]); 

  return (
    <div>
      <h2>Your Messages</h2>
      {messages.map(message => (
        <div key={message.id}>
          <h3>{message.title}</h3> 
          <p>{message.content}</p> 
          <p>Received: {message.timestamp}</p>
          {/* ... display other message details ... */}
        </div>
      ))}
    </div>
  );
}

export default Messages;