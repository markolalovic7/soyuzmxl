import { useParams } from "react-router";

import { useGAPageView } from "../../../../hooks/google-analytics-hooks";

import CouponpageCentralContent from "./CouponpageCentralContent/CouponpageCentralContent";

const Couponpage = () => {
  const { eventPathIds, sportCode } = useParams();

  useGAPageView("Coupon Page");

  return <CouponpageCentralContent eventPathIds={eventPathIds.split(",")} sportCode={sportCode} />;
};

export default Couponpage;
