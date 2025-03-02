import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { HiMenuAlt3 } from "react-icons/hi";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User Info:", result.user);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <header className="chat-header">
      <div className="left-section">
        <HiMenuAlt3 className="sidebar-toggle" onClick={toggleSidebar} />
        <h3 className="chat-title">ChatFPT</h3>
      </div>

      <div>
        {user ? (
          <div className="user-info">
            <img src={user.photoURL} alt="Avatar" className="user-avatar" />
            <span>{user.displayName}</span>
            <button className="btn btn-danger ms-3" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <button className="btn btn-dark" onClick={handleLogin}>
            Đăng nhập với Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
