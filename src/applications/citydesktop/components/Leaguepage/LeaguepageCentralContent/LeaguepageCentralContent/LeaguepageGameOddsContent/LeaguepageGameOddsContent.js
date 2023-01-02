import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCouponData } from "../../../../../../common/hooks/useCouponData";
import { useLiveData } from "../../../../../../common/hooks/useLiveData";
import classes from "../../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../../../Common/utils/complexCouponSportCodes";
import { addLiveContentByEventPath, addPrematchContentByDate } from "../../../../Common/utils/dataAggregatorUtils";

import GameOddsSportsContentHolder from "./GameOddsSportsContentHolder/GameOddsSportsContentHolder";

const dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const combineContent = (eventPathId, prematchData, liveData) => {
  // Always add prematch first, and live on top

  const content = [];

  addLiveContentByEventPath(content, liveData, eventPathId);
  addPrematchContentByDate(content, prematchData);

  return content;
};

const isCouponReadyToShow = (activeEventPathId, subscribed, prematchLoading, prematchCouponData) => {
  if (subscribed && prematchCouponData) {
    return true;
  }

  return false;
};

const LeaguepageGameOddsContent = ({ activeEventPathId, sportCode }) => {
  // Subscribe to live data...
  const dispatch = useDispatch();

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[`p${activeEventPathId}`]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[`p${activeEventPathId}`]);

  const code = activeEventPathId ? `p${activeEventPathId}` : null;
  useCouponData(
    dispatch,
    code,
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

  // Subscribe to live data...
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const combinedContent = combineContent(activeEventPathId, prematchCouponData, europeanDashboardLiveData);

  const isReady = isCouponReadyToShow(
    activeEventPathId,
    europeanDashboardLiveData,
    prematchLoading,
    prematchCouponData,
  );

  return isReady ? (
    <GameOddsSportsContentHolder dates={combinedContent} sportCode={sportCode} />
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

const propTypes = {
  activeEventPathId: PropTypes.number.isRequired,
};
LeaguepageGameOddsContent.propTypes = propTypes;

export default React.memo(LeaguepageGameOddsContent);
