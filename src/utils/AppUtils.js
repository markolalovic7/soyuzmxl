import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthAccountId, getAuthIFrameQueryParamsProcessed, getAuthLoggedIn } from "redux/reselect/auth-selector";
import { getCmsConfigBrandDetails } from "redux/reselect/cms-selector";
import { loadSingleWalletBalance } from "redux/slices/balanceSlice";

require("dayjs/locale/de");
require("dayjs/locale/es");
require("dayjs/locale/fr");
require("dayjs/locale/id");
require("dayjs/locale/hi");
require("dayjs/locale/ja");
require("dayjs/locale/km");
require("dayjs/locale/ko");
require("dayjs/locale/ms");
require("dayjs/locale/pt");
require("dayjs/locale/ru");
require("dayjs/locale/th");
require("dayjs/locale/te");
require("dayjs/locale/vi");
require("dayjs/locale/zh");

// https://day.js.org/docs/en/parse/string-format
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

export function getDesktopOriginId() {
  const originId = process.env.REACT_APP_DESKTOP_ORIGIN_ID || 3; // originID configured at env variable level. In production this is in Apache.

  return originId;
}

export function getMobileOriginId() {
  const originId = process.env.REACT_APP_MOBILE_ORIGIN_ID || 11; // originID configured at env variable level. In production this is in Apache.

  return originId;
}

export function getBetPointOriginId() {
  const originId = process.env.REACT_APP_BETPOINT_ORIGIN_ID || 4; // originID configured at env variable level. In production this is in Apache.

  return originId;
}

export function getSlipstreamOriginId() {
  const originId = process.env.REACT_APP_SLIPSTREAM_ORIGIN_ID || 4; // originID configured at env variable level. In production this is in Apache.

  return originId;
}

export function getDesktopLineId() {
  const lineId = process.env.REACT_APP_DESKTOP_LINE_ID || 2; // originID configured at env variable level. In production this is in Apache.

  return lineId;
}

export function getMobileLineId() {
  const lineId = process.env.REACT_APP_MOBILE_LINE_ID || 2; // originID configured at env variable level. In production this is in Apache.

  return lineId;
}

export function getBetPointLineId() {
  const lineId = process.env.REACT_APP_BETPOINT_LINE_ID || 2; // originID configured at env variable level. In production this is in Apache.

  return lineId;
}

export function getSlipstreamLineId() {
  const lineId = process.env.REACT_APP_SLIPSTREAM_LINE_ID || 2; // originID configured at env variable level. In production this is in Apache.

  return lineId;
}

export function useThirdPartyBalance(dispatch) {
  const loggedIn = useSelector(getAuthLoggedIn);
  const accountId = useSelector(getAuthAccountId);
  const authIFrameQueryParamsProcessed = useSelector(getAuthIFrameQueryParamsProcessed);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  useEffect(() => {
    if (
      authIFrameQueryParamsProcessed &&
      cmsConfigBrandDetails &&
      loggedIn &&
      cmsConfigBrandDetails.data.singleWalletMode &&
      !process.env.REACT_APP_SLIPSTREAM_ON
    ) {
      dispatch(loadSingleWalletBalance({ accountId }));

      const interval = setInterval(() => {
        dispatch(loadSingleWalletBalance({ accountId }));
      }, 5000);

      return () => {
        // unsubscribe
        clearInterval(interval);
      };
    }

    return undefined;
  }, [dispatch, authIFrameQueryParamsProcessed, cmsConfigBrandDetails, accountId, loggedIn]);
}
