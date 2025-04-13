import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const { i18n } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLanguageSwitch = async (lang) => {
    if (lang === "fr") {
      const emailVerified = await handleEmailVerification();
      if (!emailVerified) return;
    } else {
      const mobileVerified = await handleMobileVerification();
      if (!mobileVerified) return;
    }
    
    i18n.changeLanguage(lang);
    onLanguageChange(lang);
  };

  const handleEmailVerification = async () => {
    setIsVerifying(true);
    // Simulate email verification process
    setTimeout(() => {
      alert("Email OTP Verified ✅");
      setIsVerifying(false);
    }, 2000);
    return true;
  };

  const handleMobileVerification = async () => {
    setIsVerifying(true);
    // Simulate mobile OTP verification
    setTimeout(() => {
      alert("Mobile OTP Verified ✅");
      setIsVerifying(false);
    }, 2000);
    return true;
  };

  return (
    <div>
      <h2>Select Language</h2>
      <select
        value={selectedLanguage}
        onChange={(e) => handleLanguageSwitch(e.target.value)}
        disabled={isVerifying}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
