import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://your-backend-api.com/api/chats")
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Lịch sử chat</h2>
      </div>

      <div className="chat-list">
        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
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
