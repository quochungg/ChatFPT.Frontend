import React, { useState, useContext, useEffect } from "react";
import { FaSun, FaMoon, FaGlobe, FaCog } from "react-icons/fa";
import "./SettingsButton.css";
import LanguageContext from "../context/LanguageContext"; 
import ThemeContext from "../context/ThemeContext";

const SettingsButton = () => {
  
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  
  const { language, toggleLanguage } = useContext(LanguageContext);

  
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  
  const togglePopUpVisibility = () => {
    setIsPopUpVisible((prev) => !prev);
  };

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div className="settings-container">
      {}
      <button className="settings-button" onClick={togglePopUpVisibility}>
        <FaCog size={24} />
      </button>

      {isPopUpVisible && (
        <div className="settings-pop-up">
          <ul>
            <li onClick={toggleDarkMode}>
              {darkMode ? <FaSun style={{ marginRight: "8px" }} /> : <FaMoon style={{ marginRight: "8px" }} />}
              {darkMode
                ? language === "vi"
                  ? "Chế độ sáng"
                  : "Light Mode"
                : language === "vi"
                ? "Chế độ tối"
                : "Dark Mode"}
            </li>
            <li onClick={toggleLanguage}>
              <FaGlobe style={{ marginRight: "8px" }} />
              {language === "vi" ? "Tiếng Anh" : "Vietnamese"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
