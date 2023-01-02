import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useCouponData } from "../../../../../../common/hooks/useCouponData";

import SlimMobileCoupon from "./SlimMobileCoupon/SlimMobileCoupon";

const SlimEventPathCoupon = () => {
  const { eventPathId } = useParams();
  const { eventId } = useParams(); // used in case of redirects from pages that open a single event...

  const dispatch = useDispatch();
  const pathCouponData = useSelector((state) => state.coupon.couponData[eventPathId]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[eventPathId]);

  const [activeMatchId, setActiveMatchId] = useState(null);

  useEffect(() => {
    setActiveMatchId(null); // Clear the active match Id when we navigate under a different path
  }, [eventPathId]);

  useCouponData(dispatch, eventPathId, "ALL", false, null, false, false, true, false, null);

  return (
    <SlimMobileCoupon
      activeMatchId={activeMatchId}
      couponData={pathCouponData}
      filterEventId={eventId ? parseInt(eventId, 10) : null}
      loading={pathLoading}
      setActiveMatchId={setActiveMatchId}
    />
  );
};

export default SlimEventPathCoupon;
