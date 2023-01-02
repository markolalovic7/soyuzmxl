import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { useGetMatchStatuses } from "../../../../../../../../hooks/matchstatus-hooks";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../scss/citywebstyle.module.scss";

const periodAndClock = (cType, cStatus, currentPeriod, min, sec) => {
  let clock = currentPeriod;

  switch (cType) {
    case "NO_TIME":
      // switch (cStatus) {
      //     case 'NOT_STARTED':
      //         clock = 'About to Start';
      //         break;
      //     case 'END_OF_EVENT':
      //         clock = 'Ended';
      //         break;
      //     default:
      //         clock = cStatus.charAt(0).toUpperCase() + cStatus.slice(1).toLowerCase();
      //         break;
      // }
      break;
    // Do nothing for this kind of sports
    default:
      clock = `${currentPeriod} ${`0${min}`.slice(-2)}m`;
      break;
  }

  return clock;
};

const LeftNavigationMatch = ({ activeMatchId, expanded, match, onClick, onToggleFavourites }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));
  const matchStatuses = useGetMatchStatuses(dispatch);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  const cPeriod = match?.cPeriod;

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <div
      className={`${classes["left-panel__spoiler-content"]} ${
        match.eventId === activeMatchId ? classes["selected"] : ""
      } ${expanded ? classes["opened"] : ""}`}
    >
      <div onClick={onClick}>
        <div className={classes["left-panel__spoiler-item"]}>
          <span className={classes["left-panel__spoiler-team"]}>{match.opADesc}</span>
          <span className={classes["left-panel__spoiler-score"]}>
            <span className={classes["left-panel__spoiler-icon"]} onClick={onToggleFavourites}>
              <svg height="16" viewBox="0 0 16 14" width="17" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.01123 0L9.69509 5.18237H15.1442L10.7358 8.38525L12.4196 13.5676L8.01123 10.3647L3.60284 13.5676L5.2867 8.38525L0.878306 5.18237H6.32738L8.01123 0Z" />
              </svg>
            </span>
            {match.hScore && match.aScore ? `${match.hScore}-${match.aScore}` : ""}
          </span>
        </div>
        <div className={classes["left-panel__spoiler-item"]}>
          <span className={classes["left-panel__spoiler-team"]}>{match.opBDesc}</span>
          <span className={classes["left-panel__spoiler-time"]}>
            {periodAndClock(match.cType, match.cStatus, cPeriod, match.cMin, match.cSec)}
          </span>
        </div>
      </div>
      {Object.values(match.markets).map((market) => {
        if (market.mGroup !== "MONEY_LINE") return null;

        return (
          <div className={classes["left-panel__spoiler-outcomes"]} key={market.mId}>
            {market.sels.map((sel) => (
              <div
                className={cx(classes["left-panel__spoiler-outcome"], {
                  [classes["active"]]: betslipOutcomeIds.includes(sel.oId),
                })}
                key={sel.oId}
                onClick={() => toggleBetslipHandler(sel.oId, match.eventId)}
              >
                <span>{sel.oDesc}</span>
                <span>{sel.formattedPrice}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

LeftNavigationMatch.propTypes = {
  activeMatchId: PropTypes.number,
  match: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggleFavourites: PropTypes.func.isRequired,
};

export default React.memo(LeftNavigationMatch);
