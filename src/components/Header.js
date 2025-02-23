import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";

const Header = () => {
  const [user, setUser] = useState(null);

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

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h3>ChatFPT</h3>
      <div>
        {user ? (
          <div className="d-flex align-items-center">
            <img src={user.photoURL} alt="Avatar" className="rounded-circle me-2" width="40" height="40" />
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
