import React, { useState, useContext } from "react";
import { FaCommentDots } from "react-icons/fa";
import "./Sidebar.css";
import SettingsButton from "./SettingsButton";
import LanguageContext from "../context/LanguageContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [chats, setChats] = useState([
    { id: 1, name: "Cuộc trò chuyện 1" },
    { id: 2, name: "Cuộc trò chuyện 2" },
    { id: 3, name: "Cuộc trò chuyện 3" },
  ]);

  const { language } = useContext(LanguageContext);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>{language === "vi" ? "Lịch sử chat" : "Chat History"}</h2>
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <div key={chat.id} className="chat-item">
            <FaCommentDots className="chat-icon" />
            <span>{chat.name}</span>
          </div>
        ))}
      </div>

      {}
      {isOpen && (
        <div className="sidebar-footer">
          <SettingsButton />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
