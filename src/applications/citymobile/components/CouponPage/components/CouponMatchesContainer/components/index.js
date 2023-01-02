import Spinner from "applications/common/components/Spinner";
import * as PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeGetLiveEuropeanDashboardData } from "../../../../../../../redux/reselect/live-selector";
import complexCouponSportCodes from "../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import {
  addLiveContentBySport,
  addPrematchContentByLeague,
} from "../../../../../../citydesktop/components/Common/utils/dataAggregatorUtils";
import { useCouponData } from "../../../../../../common/hooks/useCouponData";
import { useLiveData } from "../../../../../../common/hooks/useLiveData";
import classes from "../../../../../scss/citymobile.module.scss";

import LeagueCouponContainer from "./LeagueCouponContainer";

const sortMixedPrematchAndLiveEventPaths = (a, b) => {
  if (a.categoryPos !== b.categoryPos) {
    return a.pos - b.pos;
  }
  if (a.leaguePos !== b.leaguePos) {
    return a.pos - b.pos;
  }

  return `${a.categoryDescription} - ${a.tournamentDescription}`.localeCompare(
    `${b.categoryDescription} - ${b.tournamentDescription}`,
  );
};

const combineContent = (sport, prematchData, liveData) => {
  // Always add prematch first, and live on top

  const content = [];

  addPrematchContentByLeague(content, prematchData, sport);

  addLiveContentBySport(content, liveData, sport);

  content.sort(sortMixedPrematchAndLiveEventPaths);

  return content;
};

/**
 *
 * @param prematchModeOn - whether we will load prematch data
 * @param liveModeOn - whether we will load live data
 * @param sportSelectorModeOn - whether we will show the sports selector (bar)
 * @param dateSelectorModeOn - whether we will show the date selector (bar)
 * @param sportFilter - whether we will filter the data for a specific sport code
 * @param eventPathFilter - whether we will filter the data for a specific event path (country and / or league)
 * @param prematchDateFrom - whether we will filter prematch data within a date range (FROM)
 * @param prematchDateTo - whether we will filter prematch data within a date range (TO)
 * @returns {JSX.Element}
 * @constructor
 */
const CouponMatchesContainer = ({ eventPaths, sportCode }) => {
  const dispatch = useDispatch();

  // Obtain prematch and live data...

  // ********** LIVE DATA ********** //
  // Memoize selector to get correct data.
  const getLiveEuropeanDashboardData = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector((state) =>
    getLiveEuropeanDashboardData(state, {
      eventPathIds: eventPaths,
      sportCode,
    }),
  );

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  // ************ END LIVE DATA ************** //

  // ************ PREMATCH DATA ************** //
  const prematchSdcCode = eventPaths.map((l) => `p${l}`).join(",");

  const prematchCouponData = useSelector((state) => state.coupon.couponData[prematchSdcCode]);

  // ************ END PREMATCH DATA ************** //

  useCouponData(
    dispatch,
    prematchSdcCode,
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
    null,
    null,
  );

  const combinedContent = combineContent(sportCode, prematchCouponData, liveEuropeanData);

  const isReady = prematchCouponData && liveEuropeanData;

  return (
    <div className={`${classes["sports-container"]} ${classes["is-active"]}`}>
      {!isReady ? (
        <Spinner className={classes.loader} />
      ) : (
        combinedContent.map((league) => (
          <LeagueCouponContainer
            container={league}
            key={`${league.categoryDescription} - ${league.tournamentDescription}`}
            sportCode={sportCode}
            strictLive={false}
          />
        ))
      )}
    </div>
  );
};

const propTypes = {
  eventPaths: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

CouponMatchesContainer.propTypes = propTypes;
CouponMatchesContainer.defaultProps = defaultProps;

export default CouponMatchesContainer;
