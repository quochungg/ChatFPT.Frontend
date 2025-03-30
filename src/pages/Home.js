import React from "react";
import Header from "../components/Header";
import ChatInput from "../components/ChatInput";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="chat-container">
        <Header />
        <ChatInput />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
