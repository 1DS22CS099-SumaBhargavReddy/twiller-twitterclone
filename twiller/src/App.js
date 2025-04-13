import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import LanguageSelector from "./components/LanguageSelector";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Login/Signup";
import Feed from "./Pages/Feed/Feed";
import Explore from "./Pages/Explore/Explore";
import Notification from "./Pages/Notification/Notification";
import Message from "./Pages/Messages/Message";
import Lists from "./Pages/Lists/Lists";
import Profile from "./Pages/Profile/Profile";
import More from "./Pages/more/More";
import Bookmark from "./Pages/Bookmark/Bookmark";
import "./i18n.js";
import "./App.css";

const App = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Function to handle language switch
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  return (
    <div className="app">
      {/* Multi-language support */}
      <h1>{t("welcome")}</h1>
      <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />

      {/* Context provider for user authentication state */}
      <UserAuthContextProvider>
        <Routes>
          {/* Protected home route, accessible only when authenticated */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
          </Route>

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Home route with nested pages */}
          <Route path="/home" element={<Home />}>
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notification" element={<Notification />} />
            <Route path="messages" element={<Message />} />
            <Route path="lists" element={<Lists />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
          </Route>
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
};

export default App;
