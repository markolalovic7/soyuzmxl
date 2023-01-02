import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../hooks/matchstatus-hooks";

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {};

const LiveCouponMatchClockAndPeriod = ({ match }) => {
  const dispatch = useDispatch();

  const [min, setMin] = useState(match.cMin);
  const [sec, setSec] = useState(match.cSec);

  const matchStatuses = useGetMatchStatuses(dispatch);

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
  const cPeriod = match.cPeriod;

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

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

  return (
    <div className={classes["result__match-time"]}>
      <span style={{ textTransform: "capitalize" }}>{clock}</span>
      {` `}
      <span>{currentPeriod}</span>
    </div>
  );
};

LiveCouponMatchClockAndPeriod.propTypes = propTypes;
LiveCouponMatchClockAndPeriod.defaultProps = defaultProps;

export default LiveCouponMatchClockAndPeriod;
