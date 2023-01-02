import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { searchForCouponData } from "redux/slices/couponSlice";

import SlimMobileCoupon from "./SlimMobileCoupon/SlimMobileCoupon";

const SlimSearchCoupon = () => {
  const { searchPhrase } = useParams();

  const dispatch = useDispatch();
  const searchCouponData = useSelector((state) => state.coupon.searchCouponData);
  const searchLoading = useSelector((state) => state.coupon.searchLoading);

  const [activeMatchId, setActiveMatchId] = useState(null);

  useEffect(() => {
    setActiveMatchId(null);

    const eventPathSubscriptionData = {
      allMarkets: false,
      keyword: searchPhrase,
      live: false,
      virtual: false,
      // african: false,
      // asianCriteria: null,
      // marketTypeGroups: null,
      // count: null,
      // from: null,
    };

    dispatch(searchForCouponData({ ...eventPathSubscriptionData }));

    return () => {
      // unsubscribe
    };
  }, [dispatch, searchPhrase]);

  return (
    <SlimMobileCoupon
      activeMatchId={activeMatchId}
      couponData={searchCouponData}
      loading={searchLoading}
      setActiveMatchId={setActiveMatchId}
    />
  );
};

export default SlimSearchCoupon;
