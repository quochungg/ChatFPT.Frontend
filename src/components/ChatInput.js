import React from "react";

const ChatInput = () => {
  return (
    <div className="text-center mt-5">
      <h2>Tôi có thể giúp gì cho bạn?</h2>
      <div className="input-group mt-3 w-50 mx-auto">
        <input type="text" className="form-control form-control-lg" placeholder="Nhắn tin cho ChatFPT" />
        <button className="btn btn-primary">Gửi</button>
      </div>
    </div>
  );
};

export default ChatInput;