import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ userEmail, userPhone, onVerify }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [otpSent, setOtpSent] = useState(false);

  const handleChangeLanguage = (lang) => {
    if (lang === "fr") {
      sendEmailOTP(userEmail);
    } else {
      sendMobileOTP(userPhone);
    }
    setSelectedLanguage(lang);
  };

  const sendEmailOTP = (email) => {
    console.log(`Sending OTP to email: ${email}`);
    setOtpSent(true);
  };

  const sendMobileOTP = (phone) => {
    console.log(`Sending OTP to phone: ${phone}`);
    setOtpSent(true);
  };

  const verifyOTP = (otp) => {
    if (otp === "1234") {
      i18n.changeLanguage(selectedLanguage);
      onVerify(selectedLanguage);
      setOtpSent(false);
    } else {
      alert("Invalid OTP!");
    }
  };

  return (
    <div>
      <select onChange={(e) => handleChangeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="hi">हिन्दी</option>
        <option value="pt">Português</option>
        <option value="zh">中文</option>
      </select>
      {otpSent && (
        <div>
          <input type="text" placeholder="Enter OTP" onChange={(e) => verifyOTP(e.target.value)} />
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
