import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../hooks/matchstatus-hooks";
import {
  MATCH_STATUS_END_OF_EVENT,
  MATCH_STATUS_PAUSED,
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../constants";

import FontIcon from "applications/slimmobile/common/components/FontIcon";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
};

const defaultProps = {};

const MatchHeader = ({ cMin, cPeriod, cSec, cStatus, cType, eventId }) => {
  const dispatch = useDispatch();

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const matchStatuses = useGetMatchStatuses(dispatch);

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

  // todo: use translations + format function here.
  const periodAndClock = (cType, cStatus, min, sec) => {
    if (cType !== MATCH_TYPE_NO_TIME) {
      return `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`;
    }

    return (
      {
        [MATCH_STATUS_END_OF_EVENT]: "Ended",
        [MATCH_STATUS_STARTED]: "About to Start",
      }[cStatus] ?? cStatus.charAt(0).toUpperCase() + cStatus.slice(1).toLowerCase()
    );
  };

  const clock = periodAndClock(cType, cStatus, min, sec);

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <div className={`${classes["bet__header"]} ${classes["bet__header_2"]}`}>
      <div className={classes["bet__header-container"]}>
        <div className={classes["bet__period"]}>
          {[MATCH_STATUS_STARTED].includes(cStatus) && (
            <span>
              <FontIcon icon={faPlay} />
            </span>
          )}
          {[MATCH_STATUS_PAUSED].includes(cStatus) && (
            <span>
              <FontIcon icon={faPause} />
            </span>
          )}
          {`${currentPeriod} / ${clock}`}
        </div>
        <div className={`${classes["bet__id"]} ${classes["bet__id_big"]}`}>{`ID ${eventId}`}</div>
      </div>
    </div>
  );
};

MatchHeader.propTypes = propTypes;
MatchHeader.defaultProps = defaultProps;

export default MatchHeader;
