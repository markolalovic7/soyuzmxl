import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import classes from "../../../../../../scss/ollehdesktop.module.scss";

const LiveMatch = ({
  active,
  cMin,
  cSec,
  cStatus,
  cType,
  isExpanded,
  onSelect,
  periodAbrv,
  score,
  teamLeft,
  teamRight,
}) => {
  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const matchStatuses = useSelector((state) => state.matchStatus.matchStatuses);

  useEffect(() => {
    setSec(cSec);
    setMin(cMin);
  }, [cSec, cMin]);

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

  const periodDescription = useMemo(() => {
    const period = matchStatuses?.find((p) => p.abbreviation === periodAbrv);

    return period ? period.description : periodAbrv;
  }, [matchStatuses, periodAbrv]);

  useEffect(() => {
    const intervalId = setInterval(() => tickClocks(), 1000);

    return () => clearInterval(intervalId);
  }, [tickClocks]);

  return (
    <div className={cx(classes["country__spoiler-content"], { [classes["active"]]: isExpanded })} onClick={onSelect}>
      <p className={cx(classes["country__spoiler-name"], { [classes["active"]]: active })}>
        {`${teamLeft} vs ${teamRight}`}
      </p>
      <p className={classes["country__spoiler-details"]}>
        <span className={classes["country__spoiler-details--count"]}>
          {score}
          &nbsp;
        </span>
        <span>
          {`/ ${
            cType !== "NO_TIME" ? `${`${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`} / ` : ""
          } ${periodDescription}`}
        </span>
      </p>
    </div>
  );
};

LiveMatch.propTypes = {
  active: PropTypes.bool.isRequired,
  cMin: PropTypes.number.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  periodAbrv: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  teamLeft: PropTypes.string.isRequired,
  teamRight: PropTypes.string.isRequired,
};

export default React.memo(LiveMatch);
