import React from "react";

const Header = () => {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h3>ChatFPT</h3>
      <div>
        <button className="btn btn-dark me-2">Đăng nhập</button>
      </div>
    </header>
  );
};

export default Header;
