import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import "./ChatInput.css";

const ChatInput = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
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

  // ✅ Gọi API chatbot và lấy `answerId`
  const fetchBotResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `https://chatfpt.azurewebsites.net/api/ai/query?question=${encodeURIComponent(userMessage)}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
        }
      );

      const data = await response.json();
      console.log("🔹 Phản hồi từ chatbot:", data); // ✅ Log phản hồi chatbot

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

  // ✅ Gửi tin nhắn đi và nhận phản hồi từ bot
  const sendMessage = async () => {
    if (message.trim() && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);

      const userMsg = message;
      setMessage("");

      if (!showChat) setShowChat(true);

      const { text: botReply, answerId } = await fetchBotResponse(userMsg);

      setMessages((prev) => [...prev, { text: botReply, sender: "bot", answerId }]);
      setIsWaitingForResponse(false);
      setShowRating(true);
    }
  };

  // ✅ Gửi feedback lên API
  const sendFeedback = async (answerId, rate, note) => {
    console.log("🔹 Gửi feedback với dữ liệu:", { answerId, rate, note });

    try {
      const response = await fetch("https://chatfpt.azurewebsites.net/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerId: answerId,
          rate: rate,
          note: note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Lỗi từ API feedback:", errorData);
      } else {
        console.log("✅ Gửi phản hồi thành công!");
        setShowThankYouMessage(true);

        setTimeout(() => {
          setShowThankYouMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối API feedback:", error);
    }
  };

  const handleRatingClick = (rating) => {
    console.log(`User rated: ${rating}`);

    const lastBotMessage = messages.filter(msg => msg.sender === "bot").slice(-1)[0];
    const answerId = lastBotMessage?.answerId || "unknown";

    if (answerId === "unknown") {
      console.error("❌ Không tìm thấy answerId! Không thể gửi feedback.");
      return;
    }

    if (rating === "thumbs-up") {
      sendFeedback(answerId, 1, "Câu trả lời hữu ích!");
      setShowRating(false);
    } else {
      setShowFeedbackPopup(true); // ✅ Mở popup nhập feedback
    }
  };

  const handleSubmitFeedback = () => {
    const lastBotMessage = messages.filter(msg => msg.sender === "bot").slice(-1)[0];
    const answerId = lastBotMessage?.answerId || "unknown";

    if (answerId === "unknown") {
      console.error("❌ Không tìm thấy answerId! Không thể gửi feedback.");
      return;
    }

    const note = feedbackText.trim();

    if (!note) {
      alert("Vui lòng nhập phản hồi!");
      return;
    }

    sendFeedback(answerId, 0, note);

    setShowFeedbackPopup(false);
    setFeedbackText("");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-heading">{showChat ? "ChatFPT" : "Tôi có thể giúp gì cho bạn?"}</h2>
      <div className="chat-message-list scrollable" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {showThankYouMessage && <div className="thank-you-message">Cảm ơn phản hồi của bạn!</div>}

      {showRating && (
        <div className="rating-container">
          <span>Bạn thấy phản hồi này thế nào?</span>
          <button onClick={() => handleRatingClick("thumbs-up")}>👍</button>
          <button onClick={() => handleRatingClick("thumbs-down")}>👎</button>
        </div>
      )}

      {/* ✅ Popup nhập feedback */}
      {showFeedbackPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Nhập phản hồi của bạn</h3>
            <button className="popup-close" onClick={() => setShowFeedbackPopup(false)}>
              <FaTimes />
            </button>
            <textarea
              placeholder="Nhập phản hồi..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows="4"
            />
            <button className="submit-button" onClick={handleSubmitFeedback}>
              Gửi phản hồi
            </button>
          </div>
        </div>
      )}

      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={isWaitingForResponse ? "Đang chờ phản hồi..." : "Hỏi bất kỳ điều gì..."}
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={isWaitingForResponse}
        />
        <button className={`send-button ${isWaitingForResponse ? "disabled" : ""}`} onClick={sendMessage} disabled={isWaitingForResponse}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
