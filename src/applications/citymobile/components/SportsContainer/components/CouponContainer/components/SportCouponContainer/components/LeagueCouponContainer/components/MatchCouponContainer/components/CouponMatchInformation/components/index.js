import * as dayjs from "dayjs";
import * as PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import complexCouponSportCodes from "../../../../../../../../../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import classes from "../../../../../../../../../../../../../scss/citymobile.module.scss";

import CouponMatchDetails from "./CouponMatchDetails";
import CouponTeams from "./CouponTeams";

const CouponMatchInformation = ({ groupModePreference, match, sportCode }) => {
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
    if (match.live) {
      const intervalId = setInterval(() => tickClocks(), 1000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [tickClocks]);

  const history = useHistory();

  return (
    <div
      className={classes["sports-spoiler__information"]}
      onClick={() => {
        if (match.live) {
          history.push(`/events/live/${match.eventId}`);
        } else {
          history.push(`/events/prematch/${match.eventId}`);
        }
      }}
    >
      <CouponTeams
        a={match.a}
        aScore={match.aScore}
        b={match.b}
        groupModePreference={groupModePreference}
        hScore={match.hScore}
        pathDescription={`${match.categoryDescription} - ${match.tournamentDescription}`}
      />

      <CouponMatchDetails
        eventId={match.eventId}
        hasRapidMarket={!!match.hasRapidMarket}
        isClockActive={match?.cStatus === "STARTED"}
        live={match.live}
        marketCount={
          complexCouponSportCodes.includes(sportCode) ? Math.max(match.count - 3, 0) : Math.max(match.count - 1, 0)
        }
        min={min}
        periodAbr={match?.cPeriod}
        sec={sec}
        startTime={match.epoch ? dayjs.unix(match.epoch / 1000) : null}
      />
    </div>
  );
};

const propTypes = {
  match: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

CouponMatchInformation.propTypes = propTypes;
CouponMatchInformation.defaultProps = defaultProps;

export default React.memo(CouponMatchInformation);
