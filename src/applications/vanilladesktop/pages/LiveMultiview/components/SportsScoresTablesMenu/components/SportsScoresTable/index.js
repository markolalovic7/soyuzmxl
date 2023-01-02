import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "applications/vanillamobile/common/components/LiveEuropeanMatch/constants";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../../hooks/matchstatus-hooks";
import { getMultiviewEventIds } from "../../../../../../../../redux/reselect/live-selector";

export const teamsType = PropTypes.arrayOf(
  PropTypes.shape({
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
);

const propTypes = {
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onAddToMultiView: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  teams: teamsType.isRequired,
};

const defaultProps = {
  //
};

const SportsScoresTable = ({
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  eventId,
  isPaused,
  label,
  onAddToMultiView,
  onDragStart,
  teams,
}) => {
  const dispatch = useDispatch();

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const matchStatuses = useGetMatchStatuses(dispatch);
  const multiViewEventIdsStr = useSelector(getMultiviewEventIds);
  const multiViewEventIds =
    multiViewEventIdsStr.length > 0 ? multiViewEventIdsStr.split(",").map((x) => Number(x)) : [];

  // keep updated if the props evolve...
  useEffect(() => {
    setMin(cMin);
  }, [cMin]);

  // keep updated if the props evolve...
  useEffect(() => {
    setSec(cSec);
  }, [cSec]);

  useEffect(() => {
    function tickClocks() {
      switch (cType) {
        case MATCH_TYPE_REGULAR:
          if (cStatus === MATCH_STATUS_STARTED) {
            if (sec < 59) {
              setSec(sec + 1);
            } else {
              setSec(0);
              setMin(min + 1);
            }
          }
          break;
        case MATCH_TYPE_REVERSE:
          if (cStatus === MATCH_STATUS_STARTED) {
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
    }

    const intervalId = setInterval(tickClocks, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cStatus, cType, min, sec]);

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <div className={classes["menu-sports__subitem-card"]}>
      {label && <span className={classes["menu-sports__subitem-match"]}>{label}</span>}
      <div
        className={cx(classes["menu-sports-table"], { [classes["active"]]: multiViewEventIds.includes(eventId) })}
        draggable={!multiViewEventIds.includes(eventId)}
        onClick={() => onAddToMultiView(eventId)}
        onDragStart={(e) => onDragStart(e, eventId)}
      >
        <div className={classes["menu-sports-table__header"]}>
          <span className={classes["menu-sports-table__button"]}>
            {isPaused ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
          </span>
          <span className={classes["menu-sports-table__label"]}>
            {`${currentPeriod} ${
              cType !== MATCH_TYPE_NO_TIME ? ` | ${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}` : ""
            }`}
          </span>
        </div>

        <div className={classes["menu-sports-table__body"]}>
          {teams.map((team, index) => (
            <div className={classes["menu-sports-table__score"]} key={index}>
              <span className={classes["menu-sports-table__title"]}>{team.label}</span>
              <span className={classes["menu-sports-table__icon"]}>
                {team.active && team.icon && <i className={classes[`qicon-${team.icon}`]} />}
              </span>
              <div className={classes["menu-sports-table__numbers"]}>
                {team.results.map((result, index) => {
                  if (index < team.results.length - 1) {
                    // current and past periods
                    return (
                      <span
                        className={cx(classes["menu-sports-table__number"], {
                          [classes["menu-sports-table__number_highlighted"]]: index === team.results.length - 2,
                        })}
                        key={index}
                      >
                        {result}
                      </span>
                    );
                  }

                  // total score
                  return (
                    <span
                      className={cx(classes["menu-sports-table__number"], classes["menu-sports-table__number_bold"])}
                      key={index}
                    >
                      {result}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SportsScoresTable.propTypes = propTypes;
SportsScoresTable.defaultProps = defaultProps;

export default SportsScoresTable;
