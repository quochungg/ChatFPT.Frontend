import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import "./ChatInput.css";

const ChatInput = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, I'm ChatFPT! Ask me anything!", sender: "bot" },
  ]);
  const [message, setMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const messageListRef = useRef(null);
  const textareaRef = useRef(null);

  // Predefined feedback options
  const feedbackOptions = [
    "Code was incorrect",
    "Shouldn't have used Memory",
    "Don't like the style",
    "Not factually correct",
    "Didn't fully follow instructions",
    "Refused when it shouldn't have",
    "Being lazy",
    "Unsafe or problematic",
    "Biased",
    "Other",
  ];

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [message]);

  const handleSendInitial = () => {
    if (message.trim() && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      setShowChat(true);

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is an auto-reply from ChatFPT!", sender: "bot" },
        ]);
        setIsWaitingForResponse(false);
        setShowRating(true);
      }, 1000);
    }
  };

  const handleSendChat = () => {
    if (message.trim() && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      setShowRating(false);
      setShowFeedbackOptions(false);
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is an auto-reply from ChatFPT!", sender: "bot" },
        ]);
        setIsWaitingForResponse(false);
        setShowRating(true);
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

  const handleRatingClick = (rating) => {
    console.log(`User rated: ${rating}`);
    if (rating === "thumbs-down") {
      setShowFeedbackOptions(true);
    } else {
      setShowRating(false);
    }
  };

  const handleFeedbackOptionClick = (option) => {
    if (selectedFeedback.includes(option)) {
      setSelectedFeedback(selectedFeedback.filter((item) => item !== option));
    } else {
      setSelectedFeedback([...selectedFeedback, option]);
    }
  };

  const handleMoreClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", {
      selectedOptions: selectedFeedback,
      additionalText: feedbackText,
    });
    setShowPopup(false);
    setShowFeedbackOptions(false);
    setShowRating(false);

    // Show thank you message for 3 seconds
    setShowThankYouMessage(true);
    setTimeout(() => {
      setShowThankYouMessage(false);
    }, 3000);

    setSelectedFeedback([]);
    setFeedbackText("");
  };

  // New function to handle single feedback option selection and auto-submit
  const handleSingleFeedbackSelection = (option) => {
    setSelectedFeedback([option]);
    setTimeout(() => {
      handleSubmitFeedback();
    }, 100);
  };

  // Helper function to group messages by sender for better spacing
  const renderMessages = () => {
    return messages.map((msg, index) => {
      const bubbleClass = msg.sender === "user" ? "user-bubble" : "bot-bubble";

      // Determine if this is the first message in a series from the same sender
      const isFirstInSeries =
        index === 0 || messages[index - 1].sender !== msg.sender;

      return (
        <div key={index} className={`chat-message-bubble ${bubbleClass}`}>
          {msg.text}
        </div>
      );
    });
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
              disabled={isWaitingForResponse}
            />
            <button
              className={`send-button ${
                isWaitingForResponse ? "disabled" : ""
              }`}
              onClick={handleSendInitial}
              disabled={isWaitingForResponse}
            >
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="chat-heading">ChatFPT</h2>
          <div 
            className="chat-message-list scrollable" 
            ref={messageListRef}
            style={{ height: "400px" }} // Fixed height
          >
            {renderMessages()}

            {isWaitingForResponse && (
              <div className="chat-message-bubble bot-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          {showThankYouMessage && (
            <div className="thank-you-message">Thanks for your feedback!</div>
          )}

          <div className="controls-container">
            {showRating && !showThankYouMessage && (
              <div className="rating-container">
                <span>How was the answer?</span>
                <button onClick={() => handleRatingClick("thumbs-up")}>👍</button>
                <button onClick={() => handleRatingClick("thumbs-down")}>
                  👎
                </button>
                <button onClick={handleMoreClick}>More</button>
              </div>
            )}

            {showFeedbackOptions && !showThankYouMessage && (
              <div className="feedback-options">
                {feedbackOptions.slice(0, 5).map((option, index) => (
                  <button
                    key={index}
                    className={`feedback-option ${
                      selectedFeedback.includes(option) ? "selected" : ""
                    }`}
                    onClick={() => handleSingleFeedbackSelection(option)}
                  >
                    {option}
                  </button>
                ))}
                <button className="feedback-option" onClick={handleMoreClick}>
                  More...
                </button>
              </div>
            )}
          </div>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>Provide additional feedback</h3>
                <button className="popup-close" onClick={handleClosePopup}>
                  <FaTimes />
                </button>

                <div className="feedback-options-container">
                  {feedbackOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`feedback-option-button ${
                        selectedFeedback.includes(option) ? "selected" : ""
                      }`}
                      onClick={() => handleFeedbackOptionClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="(Optional) Feel free to add specific details"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows="4"
                />

                <button
                  className="submit-button"
                  onClick={handleSubmitFeedback}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          <div className="chat-input-wrapper" style={{ marginTop: "20px" }}>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder={
                isWaitingForResponse
                  ? "Đang chờ phản hồi..."
                  : "Hỏi bất kỳ điều gì..."
              }
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isWaitingForResponse}
            />
            <button
              className={`send-button ${
                isWaitingForResponse ? "disabled" : ""
              }`}
              onClick={handleSendChat}
              disabled={isWaitingForResponse}
            >
              <FaPaperPlane />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInput;