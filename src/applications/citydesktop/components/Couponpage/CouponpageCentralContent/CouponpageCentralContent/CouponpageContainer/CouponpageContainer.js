import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCouponData } from "../../../../../../common/hooks/useCouponData";
import classes from "../../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../../../Common/utils/complexCouponSportCodes";
import { addPrematchContentByLeague } from "../../../../Common/utils/dataAggregatorUtils";

import CouponLeaguesSportsContentHolder from "./CouponLeaguesSportsContentHolder/CouponLeaguesSportsContentHolder";

const dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const combineContent = (eventPathIds, prematchData) => {
  // Always add prematch first, and live on top

  const content = [];

  addPrematchContentByLeague(content, prematchData);

  return content;
};

const isCouponReadyToShow = (eventPathIds, prematchLoading, prematchCouponData) => {
  if (prematchCouponData) {
    return true;
  }

  return false;
};

const CouponpageContainer = ({ eventPathIds, sportCode }) => {
  // Subscribe to live data...
  const dispatch = useDispatch();

  // Subscribe to prematch data...
  const eventPathIdSearchCode = eventPathIds ? eventPathIds.map((eventPathId) => `p${eventPathId}`).join(",") : null;
  const prematchCouponData = useSelector((state) => state.coupon.couponData[eventPathIdSearchCode]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[eventPathIdSearchCode]);

  useCouponData(
    dispatch,
    eventPathIdSearchCode,
    "GAME",
    false,
    complexCouponSportCodes.includes(sportCode)
      ? ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
      : null,
    false,
    false,
    true,
    false,
    null,
    true,
  );

  const combinedContent = combineContent(eventPathIds, prematchCouponData);

  const isReady = isCouponReadyToShow(eventPathIds, prematchLoading, prematchCouponData);

  return isReady ? (
    <CouponLeaguesSportsContentHolder leagues={combinedContent} sportCode={sportCode} />
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

const propTypes = {
  eventPathIds: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
};
CouponpageContainer.propTypes = propTypes;

export default React.memo(CouponpageContainer);
