import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18next
  .use(initReactI18next)
  .use(HttpApi) // Registering the back-end plugin
  .init({
    // The initReactI18next options
    backend: {
      // bump it up if we want to force a translation new version (it help with caching). We do not want to force it random as caching does help when not releasing often.
      queryStringParams: { v: process.env.REACT_APP_I18NEXT_TAG ?? "1.3.7" },
    },
    debug: process.env.NODE_ENV === "development",
    // ns: ['common', 'moduleA', 'moduleB'],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
