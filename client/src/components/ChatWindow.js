import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MessageInput from "./MessageInput";

const socket = io("http://localhost:5000"); 

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinChat", chatId);

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  const handleSendMessage = (messageContent) => {
    socket.emit("sendMessage", {
      chatId,
      content: messageContent,
      senderId: "someUserId", 
    });
  };

  return (
    <div>
      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg.content}
            </div>
          ))}
        </div>
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
