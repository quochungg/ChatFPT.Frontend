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

function ChatInput() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatFPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatFPT",
      direction: "incoming",  // ChatFPT's message on the left
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (message) => {
    if (message.trim()) {
      const newMessage = {
        message,
        direction: "outgoing",  // User's message on the right
        sender: "user",
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setIsTyping(true);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",  // Full screen height
        display: "flex",
        justifyContent: "center",  // Center horizontally
        alignItems: "center",  // Center vertically
      }}
    >
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatFPT is typing" /> : null
            }
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatInput;
