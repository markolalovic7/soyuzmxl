import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";

import { useCouponData } from "../../../common/hooks/useCouponData";
import PrematchSportCentralSectionContent from "../PrematchSportCentralSectionContent";

const PrematchCentralSection = () => {
  const dispatch = useDispatch();

  const { search } = useLocation();
  const { eventPathId: eventPathIdStr } = useParams();
  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? Number(eventIdStr) : undefined;
  const eventPathId = eventPathIdStr ? Number(eventPathIdStr) : undefined;
  const query = new URLSearchParams(search);
  const max = query.get("max");
  const virtual = query.get("virtual");
  const live = query.get("live");

  const { t } = useTranslation();

  const code = eventId ? `${live ? "l" : "e"}${eventId}` : eventPathId ? `p${eventPathId}` : undefined;
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);

  useCouponData(
    dispatch,
    code,
    !eventId ? "ALL" : "GAME",
    !!eventId,
    null,
    live,
    virtual ? (max ? "1" : "true") : false, // handle the diff expectations between SDC and next here
    false,
    false,
    max
      ? {
          nextMode: true,
          searchLimit: max,
        }
      : null,
  );

  const isEvent = !!eventId;

  return (
    <PrematchSportCentralSectionContent
      isEvent={isEvent}
      live={live}
      pathCouponData={pathCouponData}
      pathLoading={pathLoading}
      virtual={virtual}
    />
  );
};

export default React.memo(PrematchCentralSection);
