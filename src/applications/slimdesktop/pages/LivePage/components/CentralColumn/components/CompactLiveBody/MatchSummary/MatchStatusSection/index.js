import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../../../../hooks/matchstatus-hooks";
import classes from "../../../../../../../../scss/slimdesktop.module.scss";

const propTypes = {
  cMin: PropTypes.string.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.string.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
};

const MatchStatusSection = ({ cMin, cPeriod, cSec, cStatus, cType }) => {
  const dispatch = useDispatch();

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const matchStatuses = useGetMatchStatuses(dispatch);

  // Maintain clock times...
  const tickClocks = useCallback(() => {
    switch (cType) {
      case "REGULAR":
        if (cStatus === "STARTED") {
          if (sec < 59) {
            setSec(sec + 1);
          } else {
            setSec(0);
            setMin(min + 1);
          }
        }
        break;
      case "REVERSE":
        if (cStatus === "STARTED") {
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
  }, [sec, min, cStatus, cType]);

  useEffect(() => {
    const intervalId = setInterval(() => tickClocks(), 1000);

    return () => clearInterval(intervalId);
  }, [tickClocks]);

  let clock = "";

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  switch (cType) {
    case "NO_TIME":
      switch (cStatus) {
        case "NOT_STARTED":
          clock = "About to Start";
          break;
        case "END_OF_EVENT":
          clock = "Ended";
          break;
        default:
          clock = cStatus.charAt(0).toUpperCase() + cStatus.slice(1).toLowerCase();
          break;
      }
      break;
    default:
      clock = `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`;
      break;
  }

  return (
    <div className={cx(classes["card-live__head-item"], classes["card-live__head-item_center"])}>
      <span
        className={cx(classes["card-live__box"], classes["card-live-time"], classes["card-live-time--highlighted"])}
      >
        <span>
          <b>{clock}</b>
        </span>
        <span className={classes["card-live-time__period"]}>{currentPeriod}</span>
      </span>
    </div>
  );
};

MatchStatusSection.propTypes = propTypes;

export default React.memo(MatchStatusSection);
