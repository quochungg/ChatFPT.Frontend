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
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    if (event && event.target) {
      setMessage(event.target.value);
    }
  };
  const handleSend = (message) => {
    if (message.trim()) {
      const newMessage = {
        message,
        direction: "outgoing",
        sender: "user",
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setMessage("");
      setIsTyping(true);
    }
  };

  return (
    <div style={{ position: "relative", height: "800px", width: "700px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatFPT is typing" /> : null
            }
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput onSend={handleSend} placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatInput;
