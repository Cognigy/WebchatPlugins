import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: navigator.language, // default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;