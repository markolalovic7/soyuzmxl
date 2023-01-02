import trim from "lodash.trim";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage, getAuthPriceFormat } from "redux/reselect/auth-selector";

import { clearCoupon, loadCouponData } from "../../../redux/slices/couponSlice";

function useCouponData(
  dispatch,
  code,
  eventType,
  allMarkets,
  marketTypeGroups,
  live,
  virtual,
  shortNames,
  icon,
  next,
  compactSpread,
  fromDate,
  toDate,
  cmsMarketFilter,
) {
  const REGULAR_COUPON_REFRESH_INTERVAL = 60000;
  const FREQUENT_COUPON_REFRESH_INTERVAL = 5000;

  const language = useSelector(getAuthLanguage);
  const priceFormat = useSelector(getAuthPriceFormat);

  const sanitisedEventType = eventType && (eventType === "GAME" || eventType === "RANK") ? eventType : null; // We expect ALL/null or GAME or RANK. Anything else will be rejected by the API.
  const sanitisedMarketTypeGroups = marketTypeGroups && marketTypeGroups.length > 0 ? marketTypeGroups.join(",") : null;

  const nextMode = next ? next.nextMode : false;
  const nextCount = next ? next.searchLimit : 0;

  useEffect(() => {
    if (code && trim(code).length > 0) {
      const subscriptionData = {
        allMarkets: allMarkets || false,
        cmsMarketFilter,
        codes: code,
        // african: false,
        // asianCriteria: null,
        compactSpread: compactSpread || false,
        count: nextMode === true ? nextCount : null,
        eventType: sanitisedEventType,
        fromDate,
        icon: icon || false,
        live: live || false,
        marketTypeGroups: sanitisedMarketTypeGroups,
        shortNames: shortNames || false,
        toDate,
        virtual: virtual || false,
        // from: null,
      };

      dispatch(loadCouponData({ ...subscriptionData }));

      // Refresh periodically (only deltas will be collected by the API)
      const interval = setInterval(
        () => {
          dispatch(loadCouponData({ ...subscriptionData }));
        },
        live || virtual ? FREQUENT_COUPON_REFRESH_INTERVAL : REGULAR_COUPON_REFRESH_INTERVAL,
      );

      return () => {
        // unsubscribe
        clearInterval(interval);
        dispatch(clearCoupon({ cmsMarketFilter, codes: code }));
      };
    }

    return undefined;
  }, [
    dispatch,
    code,
    sanitisedEventType,
    allMarkets,
    sanitisedMarketTypeGroups,
    live,
    virtual,
    shortNames,
    nextMode,
    nextCount,
    fromDate,
    toDate,
    language,
    priceFormat,
    cmsMarketFilter,
  ]);
}

export { useCouponData };
