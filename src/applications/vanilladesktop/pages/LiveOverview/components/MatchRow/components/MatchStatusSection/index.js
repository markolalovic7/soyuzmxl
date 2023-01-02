import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../../hooks/matchstatus-hooks";
import {
  MATCH_STATUS_PAUSED,
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";
import classes from "../../../../../../scss/vanilladesktop.module.scss";

const MatchStatusSection = ({ cMin, cPeriod, cSec, cStatus, cType, statusDisplay }) => {
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

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <div className={classes["live-overview-item__time"]} style={{ width: "60px" }}>
      {statusDisplay && cStatus === MATCH_STATUS_STARTED && (
        <span style={{ fontSize: "12px" }}>
          <FontAwesomeIcon icon={faPlay} />
        </span>
      )}
      {statusDisplay && cStatus === MATCH_STATUS_PAUSED && (
        <span style={{ fontSize: "12px" }}>
          <FontAwesomeIcon icon={faPause} />
        </span>
      )}
      <span style={{ fontSize: "10px", textAlign: "center", whiteSpace: "pre-wrap" }}>{currentPeriod}</span>
      <span style={{ fontSize: "10px" }}>
        {cType !== MATCH_TYPE_NO_TIME ? `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}` : ""}
      </span>
    </div>
  );
};

MatchStatusSection.propTypes = {
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  statusDisplay: PropTypes.bool,
};
MatchStatusSection.defaultProps = {
  statusDisplay: true,
};

export default React.memo(MatchStatusSection);
