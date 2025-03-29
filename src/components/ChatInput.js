import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import "./ChatInput.css";

const ChatInput = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
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
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [message]);

  const fetchBotResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `https://chatfpt.azurewebsites.net/api/ai/query?question=${encodeURIComponent(
          userMessage
        )}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
        }
      );

      const data = await response.json();
      console.log("🔹 Phản hồi từ chatbot:", data);

      return {
        text: data?.data?.content || "Không nhận được phản hồi phù hợp.",
        answerId: data?.data?.answerId || null,
      };
    } catch (error) {
      console.error("❌ Lỗi khi lấy phản hồi:", error);
      return {
        text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        answerId: null,
      };
    }
  };

  const sendMessage = async () => {
    if (message.trim() && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      const userMsg = message;
      setMessage("");

      if (!showChat) setShowChat(true);

      const { text: botReply, answerId } = await fetchBotResponse(userMsg);

      setMessages((prev) => [
        ...prev,
        { text: botReply, sender: "bot", answerId },
      ]);
      setIsWaitingForResponse(false);
      setShowRating(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendFeedback = async (answerId, rate, note) => {
    console.log("🔹 Gửi feedback với dữ liệu:", { answerId, rate, note });

    try {
      const response = await fetch(
        "https://chatfpt.azurewebsites.net/api/feedbacks",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answerId,
            rate,
            note,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Lỗi khi gửi feedback:", errorText);
      } else {
        console.log("✅ Gửi phản hồi thành công!");
        setShowThankYouMessage(true);
        setTimeout(() => setShowThankYouMessage(false), 3000);
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối API feedback:", error);
    }
  };

  const getLastAnswerId = () => {
    const lastBotMsg = [...messages].reverse().find((m) => m.sender === "bot");
    return lastBotMsg?.answerId || null;
  };

  const handleRatingClick = (rating) => {
    const answerId = getLastAnswerId();

    if (!answerId) {
      console.error("❌ Không tìm thấy answerId.");
      return;
    }

    if (rating === "thumbs-up") {
      sendFeedback(answerId, 1, "Câu trả lời hữu ích!");
      setShowRating(false);
    } else {
      setShowPopup(true);
    }
  };

  const handleSubmitFeedback = () => {
    const answerId = getLastAnswerId();
    const note = feedbackText.trim();

    if (!answerId) {
      console.error("❌ Không tìm thấy answerId.");
      return;
    }

    if (!note) {
      alert("Vui lòng nhập góp ý!");
      return;
    }

    sendFeedback(answerId, 0, note);
    setShowPopup(false);
    setShowRating(false);
    setFeedbackText("");
  };

  const renderMessages = () =>
    messages.map((msg, i) => (
      <div
        key={i}
        className={`chat-message-bubble ${
          msg.sender === "user" ? "user-bubble" : "bot-bubble"
        }`}
      >
        {msg.text}
      </div>
    ));

  return (
    <div className="chat-container">
      {!showChat ? (
        <>
          <h2 className="chat-heading-closed">Tôi có thể giúp gì cho bạn?</h2>
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
              onClick={sendMessage}
              disabled={isWaitingForResponse}
            >
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="chat-heading-open">ChatFPT</h2>
          <div
            className="chat-message-list scrollable"
            ref={messageListRef}
            style={{ height: "450px", width: "1600px" }}
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
            <div className="thank-you-message">Cảm ơn phản hồi của bạn!</div>
          )}

          <div className="controls-container">
            {showRating && !showThankYouMessage && (
              <div className="rating-container">
                <span>Câu trả lời thế nào?</span>
                <button onClick={() => handleRatingClick("thumbs-up")}>
                  👍
                </button>
                <button onClick={() => handleRatingClick("thumbs-down")}>
                  👎
                </button>
              </div>
            )}
          </div>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>Góp ý phản hồi</h3>
                <button
                  className="popup-close"
                  onClick={() => setShowPopup(false)}
                >
                  <FaTimes />
                </button>
                <textarea
                  placeholder="Nhập góp ý của bạn tại đây..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows="4"
                />
                <button
                  className="submit-button"
                  onClick={handleSubmitFeedback}
                >
                  Gửi phản hồi
                </button>
              </div>
            </div>
          )}

          <div className="chat-input-wrapper" style={{ marginTop: "50px" }}>
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
              onClick={sendMessage}
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
