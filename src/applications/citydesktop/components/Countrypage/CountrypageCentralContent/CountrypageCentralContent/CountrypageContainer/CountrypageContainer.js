import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCouponData } from "../../../../../../common/hooks/useCouponData";
import classes from "../../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../../../Common/utils/complexCouponSportCodes";
import { addPrematchContentByLeague } from "../../../../Common/utils/dataAggregatorUtils";

import AllLaguesSportsContentHolder from "./AllLeaguesSportsContentHolder/AllLeaguesSportsContentHolder";

const dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const combineContent = (prematchData) => {
  // Always add prematch first, and live on top

  const content = [];

  addPrematchContentByLeague(content, prematchData);

  return content;
};

const isCouponReadyToShow = (prematchLoading, prematchCouponData) => {
  if (prematchCouponData) {
    return true;
  }

  return false;
};

const CountrypageContainer = ({ code, sportCode }) => {
  // Subscribe to Prematch data...
  const dispatch = useDispatch();

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[code]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[code]);

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

  const combinedContent = useMemo(() => {
    const combinedContent = combineContent(prematchCouponData);

    // VT - 18-Feb-2022 - Respect sorting in the CMS, where applicable
    if (code?.split(",")?.length > 1) {
      // Re-sort it all as per the CMS expectation...

      const intPrematchCodes = code.split(",").map((x) => Number(x.trim().substr(1, x.length)));
      combinedContent.sort(
        (a, b) => intPrematchCodes.indexOf(a.tournamentId) - intPrematchCodes.indexOf(b.tournamentId),
      );
    }

    return combinedContent;
  }, [code, prematchCouponData]);

  const isReady = isCouponReadyToShow(prematchLoading, prematchCouponData);

  return isReady ? (
    <AllLaguesSportsContentHolder leagues={combinedContent} sportCode={sportCode} />
  ) : (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  );
};

const propTypes = {
  code: PropTypes.string.isRequired,
};
CountrypageContainer.propTypes = propTypes;

export default React.memo(CountrypageContainer);
