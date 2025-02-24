import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

const ChatInput = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatFPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatFPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSend = (message) => {
    if (message.trim()) {
      const newMessage = {
        message,
        direction: "outgoing",
        sender: "user",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      setIsTyping(true);
      setShowChat(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "This is an auto-reply from ChatFPT!",
            sender: "ChatFPT",
            direction: "incoming",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="text-center mt-5">
      {!showChat ? (
        <>
          <h2>Tôi có thể giúp gì cho bạn?</h2>
          <div className="input-group mt-3 w-50 mx-auto">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Nhắn tin cho ChatFPT"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleSend(message)}
            >
              Gửi
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            position: "relative",
            height: "90vh",
            width: "700px",
            margin: "auto",
          }}
        >
          <MainContainer style={{ height: "100%" }}>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="ChatFPT is typing..." />
                  ) : null
                }
              >
                {messages.map((message, i) => (
                  <Message key={i} model={message} />
                ))}
              </MessageList>
              <MessageInput
                onSend={handleSend}
                placeholder="Type message here"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
};

export default ChatInput;


