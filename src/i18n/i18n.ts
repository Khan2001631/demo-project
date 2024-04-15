import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as EN from './en/en.json'
import * as FR from './fr/fr.json'
//import * as HI from './hi/hi.json'

export const resources = {
  en: {
    common: EN,
  },
  fr: {
    common: FR,
  },
  // 'hi': {
  //   common: HI,
  // },
} as const;

export const availableLanguages = Object.keys(resources);

i18n.use(initReactI18next).init({
  //lng: 'en',
  lng: localStorage.getItem('i18nextLng') || "en",
  fallbackLng: "en",
  debug: false,
  defaultNS: 'common',
  keySeparator: '.',
  nsSeparator: ':',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

// this will make translations available outside of React. In theory :D
const t = i18n.t.bind(i18n);
export { t };

export default i18n;
