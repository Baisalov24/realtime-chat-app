import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import axios from "axios";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    
    axios.get("http://localhost:5000/api/chats")
      .then((response) => setChats(response.data))
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
  };

  return (
    <div className="chat-list">
      {selectedChat ? (
        <ChatWindow chatId={selectedChat} />
      ) : (
        <div>
          <h2>Chats</h2>
          <ul>
            {chats.map((chat) => (
              <li key={chat._id} onClick={() => handleSelectChat(chat._id)}>
                {`Chat with ${chat.participants.join(", ")}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatList;
