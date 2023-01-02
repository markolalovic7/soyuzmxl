import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocaleWeekdayMonthDayNumber } from "utils/date-format";

import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../../../../../redux/reselect/auth-selector";
import { makeGetLiveEuropeanDashboardData } from "../../../../../../../../../redux/reselect/live-selector";
import complexCouponSportCodes from "../../../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import {
  addLiveContentByEventPath,
  addPrematchContentByDate,
} from "../../../../../../../../citydesktop/components/Common/utils/dataAggregatorUtils";
import { useCouponData } from "../../../../../../../../common/hooks/useCouponData";
import { useLiveData } from "../../../../../../../../common/hooks/useLiveData";
import classes from "../../../../../../../scss/citymobile.module.scss";
import MatchCouponContainer from "../../../../../../SportsContainer/components/CouponContainer/components/SportCouponContainer/components/LeagueCouponContainer/components/MatchCouponContainer/components";

const combineContent = (sport, eventPathId, prematchOn, liveOn, prematchData, liveData) => {
  const content = [];

  if (liveOn) {
    addLiveContentByEventPath(content, liveData, eventPathId);
  }

  if (prematchOn) {
    addPrematchContentByDate(content, prematchData);
    content.forEach((c, index) => {
      content[index] = { ...c, events: c.events.sort((a, b) => a.epoch - b.epoch) };
    });
  }

  return content;
};

const GameOddsSection = ({ eventPathId, liveOn, prematchOn, sportCode, strictLive }) => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleWeekdayMonthDayNumber(locale), [locale]);

  const timezoneOffset = useSelector(getAuthTimezoneOffset);
  const isComplexSport = complexCouponSportCodes.includes(sportCode);

  const dispatch = useDispatch();

  // ********** LIVE DATA ********** //
  // Memoize selector to get correct data.
  const getLiveEuropeanDashboardData = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector((state) =>
    getLiveEuropeanDashboardData(state, {
      eventPathIds: eventPathId ? [eventPathId] : [],
      sportCode,
    }),
  );

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, liveOn ? "european-dashboard" : undefined);
  // ************ END LIVE DATA ************** //

  // ************ PREMATCH DATA ************** //
  const prematchSdcCode = prematchOn ? `p${eventPathId}` : null;

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

  const combinedContent = combineContent(
    sportCode,
    eventPathId,
    prematchOn,
    liveOn,
    prematchCouponData,
    liveEuropeanData,
  );

  const isReady = (!prematchOn || (prematchOn && prematchCouponData)) && (!liveOn || (liveOn && liveEuropeanData));

  return isReady ? (
    combinedContent.map((container) => {
      const dateDescription = dayjs().utcOffset(timezoneOffset).add(container.offset, "day").format(dateFormat);

      return (
        <div className={`${classes["spoilers-item"]} ${classes["active"]}`} key={container.offset}>
          <h3 className={`${classes["sports-title"]} ${classes["sports-title_arrow"]}`}>
            {`${dateDescription} (${container.events.length})`}
          </h3>
          <div className={classes["sports-spoiler__wrapper"]}>
            <div className={`${classes["sports-spoiler__body"]} ${classes["accordion"]} ${classes["open"]}`}>
              <div
                className={`${classes["sports-spoiler"]} ${isComplexSport ? classes["sports-spoiler_outcome"] : ""}`}
              >
                {container.events.map((match) => (
                  <MatchCouponContainer
                    key={match.eventId}
                    match={match}
                    sportCode={sportCode}
                    strictLive={strictLive}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <Spinner className={classes.loader} />
  );
};

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  liveOn: PropTypes.bool.isRequired,
  prematchOn: PropTypes.bool.isRequired,
  sportCode: PropTypes.string.isRequired,
  strictLive: PropTypes.bool.isRequired,
};

const defaultProps = {};

GameOddsSection.propTypes = propTypes;
GameOddsSection.defaultProps = defaultProps;

export default GameOddsSection;
