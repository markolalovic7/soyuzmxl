import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { getRetailSelectedPlayerAccountId } from "../../../../../redux/reselect/retail-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import classes from "../../../scss/slipstream.module.scss";

const LiveMatchSummary = ({ eventPathDescription, match, showEventPathHeader }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const matchStatuses = useGetMatchStatuses(dispatch);

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const cPeriod = match.cPeriod;

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  const [min, setMin] = useState(match.cMin);
  const [sec, setSec] = useState(match.cSec);

  // Maintain clock times...
  const tickClocks = useCallback(() => {
    switch (match.cType) {
      case "REGULAR":
        if (match.cStatus === "STARTED") {
          if (sec < 59) {
            setSec(sec + 1);
          } else {
            setSec(0);
            setMin(min + 1);
          }
        }
        break;
      case "REVERSE":
        if (match.cStatus === "STARTED") {
          if (sec > 0) {
            setSec(sec - 1);
          } else if (min > 0) {
            setSec(59);
            setMin(min - 1);
          }
        }
        break;
      default:
        break;
    }
  }, [sec, min, match.cStatus, match.cType]);

  useEffect(() => {
    const intervalId = setInterval(() => tickClocks(), 1000);

    return () => clearInterval(intervalId);
  }, [tickClocks]);

  let clock = "";

  switch (match.cType) {
    case "NO_TIME":
      switch (match.cStatus) {
        case "NOT_STARTED":
          clock = "About to Start";
          break;
        case "END_OF_EVENT":
          clock = "Ended";
          break;
        default:
          clock = match.cStatus.charAt(0).toUpperCase() + match.cStatus.slice(1).toLowerCase();
          break;
      }
      break;
    default:
      clock = `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`;
      break;
  }
  const market = Object.values(match.markets).length > 0 ? Object.values(match.markets)[0] : null;

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (selectedPlayerId) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, false);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  return (
    <div className={classes["spoiler__body"]}>
      {showEventPathHeader && <div className={classes["spoiler__league"]}>{eventPathDescription}</div>}
      <div className={classes["spoiler__container"]}>
        <div className={classes["spoiler__info"]}>
          <div className={classes["spoiler__time"]}>{clock}</div>
          <div className={classes["spoiler__half"]}>
            <div className={classes["spoiler__pause"]}>
              <FontAwesomeIcon icon={match.cStatus === "STARTED" ? faPlay : faPause} />
            </div>
            <div className={classes["spoiler__quarter"]}>{cPeriod}</div>
          </div>
        </div>
        <div className={classes["spoiler__matches"]}>
          <div className={classes["spoiler__match"]}>
            <div className={classes["spoiler__team"]}>{match.opADesc}</div>
            <div className={classes["spoiler__score"]}>{match.hScore ? match.hScore : 0}</div>
          </div>
          <div className={classes["spoiler__match"]}>
            <div className={classes["spoiler__team"]}>{match.opBDesc}</div>
            <div className={classes["spoiler__score"]}>{match.aScore ? match.aScore : 0}</div>
          </div>
        </div>
        <div className={classes["spoiler__buttons"]}>
          {market?.sels?.map((selection) => {
            const disabled = match.hidden || !market.mOpen || selection.hidden;

            return (
              <div
                className={cx(
                  classes["spoiler-button"],
                  { [classes["active"]]: betslipOutcomeIds.includes(selection.oId) },
                  { [classes["disabled"]]: disabled },
                )}
                key={selection.oId}
                onClick={() => toggleBetslipHandler(selection.oId, match.id)}
              >
                <div className={classes["spoiler-button__team"]}>{selection.oDesc}</div>
                <div className={classes["spoiler-button__coeficient"]}>{selection.formattedPrice}</div>
              </div>
            );
          })}
        </div>
        <div
          className={cx(classes["spoiler__number"], { [classes["disabled"]]: false })}
          onClick={() => history.push(`/live/event/${match.eventId}`)}
        >
          {`+${Math.max(match.mCount - 1, 0)}`}
        </div>
      </div>
    </div>
  );
};

LiveMatchSummary.propTypes = {
  eventPathDescription: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  showEventPathHeader: PropTypes.bool.isRequired,
};

export default React.memo(LiveMatchSummary);
