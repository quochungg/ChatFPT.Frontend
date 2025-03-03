import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./ChatInput.css";

const ChatInput = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, I'm ChatFPT! Ask me anything!", sender: "bot" },
  ]);
  const [message, setMessage] = useState("");
  const messageListRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSendInitial = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      setShowChat(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is an auto-reply from ChatFPT!", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  const handleSendChat = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is an auto-reply from ChatFPT!", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!showChat) {
        handleSendInitial();
      } else {
        handleSendChat();
      }
    }
  };

  return (
    <div className="chat-container">
      {!showChat ? (
        <>
          <h2 className="chat-heading">Tôi có thể giúp gì cho bạn?</h2>
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Hỏi bất kỳ điều gì..."
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send-button" onClick={handleSendInitial}>
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="chat-heading">ChatFPT</h2>
          <div className="chat-message-list" ref={messageListRef}>
            {messages.map((msg, index) => {
              const bubbleClass =
                msg.sender === "user" ? "user-bubble" : "bot-bubble";

              return (
                <div
                  key={index}
                  className={`chat-message-bubble ${bubbleClass}`}
                >
                  {msg.text}
                </div>
              );
            })}
          </div>
          <div className="chat-input-wrapper" style={{ marginTop: "20px" }}>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Hỏi bất kỳ điều gì..."
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send-button" onClick={handleSendChat}>
              <FaPaperPlane />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInput;
