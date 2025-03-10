import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { HiMenuAlt3 } from "react-icons/hi";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Kiểm tra nếu đã có token trong localStorage
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
      const idToken = await user.getIdToken(); // Lấy token

      setUser(user);
      console.log("ID Token:", idToken);

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", idToken);

      // Gửi token về backend ngay sau khi đăng nhập
      await sendTokenToBackend(idToken);

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
      })
      .catch((error) => console.error("Lỗi đăng xuất:", error));
  };

  // Gửi token tới backend
  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch("https://your-backend-api.com/api/authenticate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,  // Gửi token trong header Authorization
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,  // Nếu backend cần token trong body, có thể thêm vào đây
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi gửi token");

      const data = await response.json();
      console.log("Backend Response:", data);
    } catch (error) {
      console.error("Lỗi API:", error);
    }
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
