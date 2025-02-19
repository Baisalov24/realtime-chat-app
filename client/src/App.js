import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatList from "./components/ChatList";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/chats" element={<ChatList/>} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
