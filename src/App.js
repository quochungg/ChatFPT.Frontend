import React from "react";
import Home from "./pages/Home";
import ThemeProvider from "./context/ThemeProvider"; 

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

export default App;
