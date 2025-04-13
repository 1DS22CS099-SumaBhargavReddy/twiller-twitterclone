import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { welcome: "Welcome" } },
      fr: { translation: { welcome: "Bienvenue" } },
      es: { translation: { welcome: "Bienvenido" } },
      hi: { translation: { welcome: "स्वागत है" } },
      pt: { translation: { welcome: "Bem-vindo" } },
      zh: { translation: { welcome: "欢迎" } },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
