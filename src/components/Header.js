import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { HiMenuAlt3 } from "react-icons/hi";
import "./Header.css";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", idToken);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setShowDropdown(false); 
      })
      .catch((error) => console.error("Lỗi đăng xuất:", error));
  };

  return (
    <header className="chat-header">
      <div className="left-section">
        {/* <HiMenuAlt3 className="sidebar-toggle" onClick={toggleSidebar} /> */}
        <h3 className="chat-title">ChatFPT</h3>
      </div>

      <div className="user-info">
        {user ? (
          <div
            className="avatar-wrapper"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={user.photoURL} alt="Avatar" className="user-avatar" />
          </div>
        ) : (
          <button className="google-login-btn" onClick={handleLogin}>
            <FcGoogle size={20} />
            Đăng nhập
          </button>
        )}

        {showDropdown && (
          <div className="dropdown-menu">
            <ul>
              <li>
                <button onClick={handleLogout}>
                  <FaSignOutAlt size={16} style={{ marginRight: "8px" }} />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
