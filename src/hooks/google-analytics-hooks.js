import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { getAuthAccountId, getAuthCurrencyCode, getAuthLanguage } from "../redux/reselect/auth-selector";
import { gaPageView } from "../utils/google-analytics-utils";

export function useReactGA(gaMeasurementId) {
  const language = useSelector(getAuthLanguage);
  const accountId = useSelector(getAuthAccountId); // might be nil
  const currencyCode = useSelector(getAuthCurrencyCode);

  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_ANALYTICS_ON) return;

    // Catch any init error (most likely due to ad blockers) and move on.
    try {
      ReactGA.initialize([
        {
          gaOptions: {
            currencyCode,
            language,
            userId: accountId,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          },
          trackingId: gaMeasurementId, // optional
          // gtagOptions: {...}, // optional
        },
      ]);

      // Enable this line below if you want to see the debug records in Google Analytics.
      // ReactGA.gtag("config", gaMeasurementId, { debug_mode: true });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    ReactGA.set({ language, userId: accountId }, []);
  }, [accountId, language]);
}

export function useGAPageView(title) {
  const location = useLocation();

  useEffect(() => {
    ReactGA.set({ page: location.pathname, title });
    gaPageView(title, location.pathname);
  }, []);
}
