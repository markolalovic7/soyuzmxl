import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthTimezoneOffset } from "redux/reselect/auth-selector";

import { useCouponData } from "../../../../../../common/hooks/useCouponData";
import classes from "../../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../../../Common/utils/complexCouponSportCodes";
import { addPrematchContentByHour, addPrematchContentByLeague } from "../../../../Common/utils/dataAggregatorUtils";

import DailyMatchListSportsContentHolder from "./DailyMatchListSportsContentHolder/DailyMatchListSportsContentHolder";

const combineContent = (sport, prematchData, timezoneOffset) => {
  // Always add prematch first, and live on top

  const content = [];

  if (localStorage.getItem("leagueOddsSorting") && localStorage.getItem("leagueOddsSorting") === "TIME") {
    addPrematchContentByHour(content, prematchData, timezoneOffset);
  } else {
    addPrematchContentByLeague(content, prematchData, sport);
  }

  return content;
};

const isCouponReadyToShow = (prematchLoading, prematchCouponData) => !!prematchCouponData;

const DailyMatchListSportsContent = ({ activeCarouselSport, activeDateTab }) => {
  // Subscribe to live data...
  const dispatch = useDispatch();

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[`s${activeCarouselSport}`]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[`s${activeCarouselSport}`]);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const code = activeCarouselSport ? `s${activeCarouselSport}` : null;
  const fromDate = `${dayjs()
    .utcOffset(timezoneOffset)
    .add(activeDateTab, "day")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;
  const endDate = `${dayjs()
    .utcOffset(timezoneOffset)
    .add(activeDateTab, "day")
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .set("millisecond", 999)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;

  useCouponData(
    dispatch,
    code,
    "GAME",
    false,
    complexCouponSportCodes.includes(activeCarouselSport)
      ? ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
      : null,
    false,
    false,
    true,
    false,
    null,
    true,
    fromDate,
    endDate,
  );

  const combinedContent = combineContent(activeCarouselSport, prematchCouponData, timezoneOffset);

  const isReady = isCouponReadyToShow(prematchLoading, prematchCouponData);

  const [toggleMode, setToggleMode] = useState(localStorage.getItem("leagueOddsSorting") || "LEAGUE");
  const onToggleSortMode = (mode) => {
    // mode = LEAGUE or TIME
    if (mode === "LEAGUE") {
      setToggleMode("LEAGUE");
      localStorage.setItem("leagueOddsSorting", "LEAGUE");
    } else if (mode === "TIME") {
      setToggleMode("TIME");
      localStorage.setItem("leagueOddsSorting", "TIME");
    }
  };

  return isReady ? (
    <DailyMatchListSportsContentHolder
      categories={combinedContent}
      sportCode={activeCarouselSport}
      toggleMode={toggleMode}
      onToggleSortMode={onToggleSortMode}
    />
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

const propTypes = {
  activeCarouselSport: PropTypes.string.isRequired,
  activeDateTab: PropTypes.number.isRequired,
};
DailyMatchListSportsContent.propTypes = propTypes;

export default React.memo(DailyMatchListSportsContent);
