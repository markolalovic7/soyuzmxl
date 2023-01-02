import trim from "lodash.trim";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { clearAsianCoupon, loadAsianCouponData } from "../../../redux/slices/couponSlice";

import { getAuthLanguage, getAuthPriceFormat } from "redux/reselect/auth-selector";

function useAsianCouponData(
  dispatch,
  code,
  sportCode,
  fromDate,
  toDate,
  type,
  count = undefined,
  compactSpread = false,
) {
  const REGULAR_COUPON_REFRESH_INTERVAL = 60000;

  const language = useSelector(getAuthLanguage);
  const priceFormat = useSelector(getAuthPriceFormat);

  useEffect(() => {
    if (code && trim(code).length > 0 && sportCode && trim(sportCode).length > 0) {
      const subscriptionData = {
        codes: `${code}/${type}`,
        compactSpread,

        count,
        // african: false,
        // asianCriteria: null,
        fromDate,
        sportCode,
        toDate,
        // from: null,
      };

      dispatch(loadAsianCouponData({ ...subscriptionData }));

      // Refresh periodically (only deltas will be collected by the API)
      const interval = setInterval(() => {
        dispatch(loadAsianCouponData({ ...subscriptionData }));
      }, REGULAR_COUPON_REFRESH_INTERVAL);

      return () => {
        // unsubscribe
        clearInterval(interval);
        dispatch(clearAsianCoupon({ codes: `${code}/${type}` }));
      };
    }

    return undefined;
  }, [dispatch, code, sportCode, fromDate, toDate, type, language, priceFormat]);
}

export { useAsianCouponData };
