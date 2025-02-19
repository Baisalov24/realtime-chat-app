import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем токен из localStorage
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`, // Передаем токен в заголовке
          },
        })
        .then((response) => setChats(response.data))
        .catch((err) => {
          console.error("Error fetching chats:", err);
          navigate("/login");
        });
    } else {
      navigate("/login");

    }
  }, [navigate]);

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
