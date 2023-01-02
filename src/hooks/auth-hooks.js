import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { logout, setAuthDesktopView, setAuthMobileView } from "../redux/actions/auth-actions";
import {
  getAuthIFrameQueryParamsProcessed,
  getAuthIsIframe,
  getAuthLoggedIn,
  getAuthTill,
} from "../redux/reselect/auth-selector";
import { getCmsConfigIframeMode } from "../redux/reselect/cms-selector";

import {
  forceLogin,
  loadRetailUUID,
  setAuthCurrencyCode,
  setAuthIFrameQueryParamsProcessed,
  setAuthLanguage,
  setAuthLoginURL,
  setRetailUUID,
} from "redux/slices/authSlice";
import i18next from "services/i18n";

const getSanitisedView = (isMobileDevice, view) => {
  if (isMobileDevice && view === "EUROPEAN") {
    return "VANILLA";
  }

  return view;
};

function getDefault12BetCurrencyCode(language) {
  switch (language) {
    case "en":
    case "hi":
    case "te":
      return "INR";
    case "zh":
      return "CNY";
    case "ko":
      return "KRW";
    case "th":
      return "THB";
    case "km":
      return "KHR";
    case "id":
      return "IDR";
    case "vi":
      return "VND";
    case "ms":
      return "MYR";
    case "bn":
      return "BDT";

    default:
      return "INR";
  }
}

export function useQueryParams(isMobileDevice, dispatch) {
  const { search } = useLocation();

  const isLoggedIn = useSelector(getAuthLoggedIn);

  // Load query params (account, language, token), if present
  const query = new URLSearchParams(search);
  const isCMSIframeMode = useSelector(getCmsConfigIframeMode); // whether this is configured to be in an iframe mode (CMS)
  const isInIframe = useSelector(getAuthIsIframe); // whether this is actually in an iframe

  const authIFrameQueryParamsProcessed = useSelector(getAuthIFrameQueryParamsProcessed);

  useEffect(() => {
    const accountId = query.get("accountId");
    const authToken = query.get("token");
    const rawLanguage = query.get("lang") || query.get("language");
    const language = rawLanguage ? rawLanguage.split("-")[0].split("_")[0].toLowerCase() : undefined;
    const view = query.get("view");
    const loginURL = query.get("loginURL");

    if (
      isCMSIframeMode && // only bother about this if we are in iframe mode. Else the user must follow navigation rules
      !authIFrameQueryParamsProcessed
    ) {
      if (accountId && language && authToken) {
        // TODO: move to redux
        // TODO: move to redux-> prepare()
        i18next.changeLanguage(language); // for React static text translation purposes
        dayjs.locale(language);

        dispatch(
          forceLogin({
            accountId,
            authToken,
            language,
          }),
        );

        // if no config, or app type changed...
        // const originId = isMobileDevice ? getMobileOriginId() : getDesktopOriginId();
        // const lineId = isMobileDevice ? getMobileLineId() : getDesktopLineId();
        // dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));
      } else {
        // if we are in iframe mode, and params are insufficient, make sure we treat this defensively and kick the user out
        if (isInIframe && isLoggedIn) dispatch(logout());

        // do respect any URL language preference
        if (language) {
          // TODO: move to redux
          // TODO: move to redux-> prepare()
          i18next.changeLanguage(language); // for React static text translation purposes
          dayjs.locale(language);
          dispatch(setAuthLanguage({ language }));

          if (process.env.REACT_APP_12BET_SETTING_MODE_ON) {
            // When the user is logged out, align currency and language
            dispatch(setAuthCurrencyCode({ currencyCode: getDefault12BetCurrencyCode(language) }));

            if (loginURL) {
              // allow to set a custom login URL to redirect to when user is logged out (e.g. for 12bet mobile app)
              try {
                const discard = new URL(loginURL);
                dispatch(setAuthLoginURL({ authLoginURL: loginURL }));
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }

      if (view && getSanitisedView(isMobileDevice, view)) {
        if (isMobileDevice) {
          dispatch(setAuthMobileView({ mobileView: getSanitisedView(isMobileDevice, view) }));
        } else {
          dispatch(setAuthDesktopView({ desktopView: getSanitisedView(isMobileDevice, view) }));
        }
      }

      dispatch(setAuthIFrameQueryParamsProcessed()); // use this to prevent endless loops...
    }
  }, [isCMSIframeMode, isMobileDevice, dispatch, authIFrameQueryParamsProcessed]);

  useEffect(() => {
    if (isCMSIframeMode) {
      // allow the parent frame to kick the user out programmatically
      window.addEventListener(
        "message",
        (event) => {
          const data = event.data || {};

          if (data.action === "app.iframe_effects" && data.code === "LOGOUT") {
            console.log("Received logout request");
            dispatch(logout());
          }
        },
        false,
      );
    }
  }, [isCMSIframeMode]); // never re-add
}

/**
 * BetPoint and Slipstream are retail applications.
 * Retail applications require a unique UUID that identifies them uniquely and can be activated or deactivated from our backoffice apps.
 *
 * 2 external Java mechanisms exist for this.
 * One is BridgeSocket (a socket listener which we can pull data from).
 * The other one is RingFence (a java wrapper that will run Slipstream within a chromium Java FX page). Ringfence will push a UUID into our browser.
 *
 * @param dispatch
 */
export function useRetailUUID(dispatch) {
  const authTill = useSelector(getAuthTill);

  // Register a listener for RingFence...
  // Ringfence will call when the page is opened up.
  useEffect(() => {
    window.BRIDGESOCKET = () =>
      // this will be invoked by Ringfence.
      ({
        setuuid: (uuid) => {
          dispatch(setRetailUUID({ uuid }));

          return "UUID set";
        },
      });
  }, []);

  // Attempt to reach out to BridgeSocket...
  useEffect(() => {
    if (!authTill) {
      dispatch(loadRetailUUID());
    }

    return undefined;
  }, [dispatch]);
}
