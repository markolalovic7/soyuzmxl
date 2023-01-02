import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { useGetMatchStatuses } from "../../../../hooks/matchstatus-hooks";
import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../utils/betslip-utils";
import classes from "../../scss/betpoint.module.scss";

const LiveMatchSummary = ({ eventPathDescription, match, showEventPathHeader }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const matchStatuses = useGetMatchStatuses(dispatch);

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
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, false);
    onRefreshBetslipHandler(dispatch, location.pathname);
  };

  return (
    <div className={cx(classes["spoiler__body"], classes["open"])}>
      {showEventPathHeader && (
        <div className={classes["spoiler__subtitle"]}>
          <span>{eventPathDescription}</span>
        </div>
      )}
      <div className={classes["spoiler__content"]}>
        <div className={classes["spoiler__description"]}>
          <div className={classes["spoiler__time"]}>
            <div className={classes["spoiler__time-text"]}>{clock}</div>
            <div className={classes["spoiler__quarter"]}>
              <div className={classes["spoiler__quarter-icon"]}>
                <FontAwesomeIcon icon={match.cStatus === "STARTED" ? faPlay : faPause} />
              </div>
              <div className={classes["spoiler__quarter-text"]}>{cPeriod}</div>
            </div>
          </div>
          <div className={classes["spoiler__scores"]}>
            <div className={classes["spoiler__score"]}>
              <span>{match.opADesc}</span>
              <span>{match.hScore ? match.hScore : 0}</span>
            </div>
            <div className={classes["spoiler__score"]}>
              <span>{match.opBDesc}</span>
              <span>{match.aScore ? match.aScore : 0}</span>
            </div>
          </div>
        </div>
        <div className={classes["spoiler__information"]}>
          <div className={classes["spoiler__match"]}>
            <div className={classes["spoiler__match-top"]}>
              <div className={classes["spoiler__match-title"]}>{market ? `${market.mDesc} - ${market.pDesc}` : ""}</div>
              {/* <div className={classes["spoiler__match-icon"]}> */}
              {/*  <i className={classes["qicon-video-camera"]} /> */}
              {/* </div> */}
            </div>
            <div className={classes["spoiler__match-content"]}>
              <div className={classes["spoiler__coeficients"]}>
                {market?.sels?.map((selection) => {
                  const disabled = match.hidden || !market.mOpen || selection.hidden;

                  return (
                    <div
                      className={cx(
                        classes["spoiler__coeficient"],
                        { [classes["active"]]: betslipOutcomeIds.includes(selection.oId) },
                        { [classes["disabled"]]: disabled },
                      )}
                      key={selection.oId}
                      onClick={() => toggleBetslipHandler(selection.oId, match.id)}
                    >
                      <span className={classes["spoiler__coeficient-title"]}>{selection.oDesc}</span>
                      <span className={classes["spoiler__coeficient-numbers"]}>
                        <div
                          className={cx(
                            classes["spoiler__triangle"],
                            { [classes["spoiler__triangle_red"]]: selection.dir === "<" },
                            { [classes["spoiler__triangle_green"]]: selection.dir === ">" },
                          )}
                        />
                        {selection.formattedPrice}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={classes["spoiler__icons"]}>
            <div className={classes["spoiler__icon"]}>
              <i className={classes["qicon-stats"]} />
            </div>
            <div
              className={cx(classes["spoiler__icon"], { [classes["disabled"]]: false })}
              onClick={() => history.push(`/live/event/${match.eventId}`)}
            >
              {`+${Math.max(match.mCount - 1, 0)}`}
            </div>
          </div>
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
