import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../AuthContext';
import '../css/Messages.css';  // Link to the external CSS file

function Messages() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {  // Check if user and user.id are defined
        const user_id = user.id;
        try {
          const response = await fetch(`http://localhost:5001/api/messages/${user_id}`);
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
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
    <div className="messages-container">
      <h2>Your Messages</h2>
      {messages.length > 0 ? (
        messages.map(message => (
          <div className="message-card" key={message.id}>
            <h3 className="message-title">{message.title}</h3>
            <p className="message-content">{message.content}</p>
            <p className="message-timestamp">Received: {new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="no-messages">No messages yet. Check back later!</p>
      )}
    </div>
  );
}

export default Messages;
