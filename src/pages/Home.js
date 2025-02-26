import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="home-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="chat-container">
        <Header toggleSidebar={toggleSidebar} />
        <ChatInput />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
