import React, { useState } from "react";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [chats, setChats] = useState([
    { id: 1, name: "Cuộc trò chuyện 1" },
    { id: 2, name: "Cuộc trò chuyện 2" },
    { id: 3, name: "Cuộc trò chuyện 3" },
  ]);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Lịch sử chat</h2>
        <FaTimes className="close-sidebar" onClick={toggleSidebar} />
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <div key={chat.id} className="chat-item">
            <FaCommentDots className="chat-icon" />
            <span>{chat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
