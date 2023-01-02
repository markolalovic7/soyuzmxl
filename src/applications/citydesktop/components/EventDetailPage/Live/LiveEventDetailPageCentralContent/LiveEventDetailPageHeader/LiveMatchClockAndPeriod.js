import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../../scss/citywebstyle.module.scss";

function LiveMatchClockAndPeriod(props) {
  const { t } = useTranslation();
  const [min, setMin] = useState(props.match.cMin);
  const [sec, setSec] = useState(props.match.cSec);

  // Maintain clock times...
  const tickClocks = useCallback(() => {
    switch (props.match.cType) {
      case "REGULAR":
        if (props.match.cStatus === "STARTED") {
          if (sec < 59) {
            setSec(sec + 1);
          } else {
            setSec(0);
            setMin(min + 1);
          }
        }
        break;
      case "REVERSE":
        if (props.match.cStatus === "STARTED") {
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
  }, [sec, min, props.match.cStatus, props.match.cType]);

  useEffect(() => {
    const intervalId = setInterval(() => tickClocks(), 1000);

    return () => clearInterval(intervalId);
  }, [tickClocks]);

  const periodAndClock = (match) => {
    //     "sport": "BEVO",
    //     "cType": "NO_TIME",
    //     "cMin": 0,
    //     "cSec": 0,
    //     "cStatus": "STARTED",
    //     "cPeriod": "S2",

    let clock = "";
    const period = match.cPeriod;

    switch (match.cType) {
      case "NO_TIME":
        switch (match.cStatus) {
          case "NOT_STARTED":
            clock = t("city.pages.event_detail.about_to_start");
            break;
          case "END_OF_EVENT":
            clock = t("city.pages.event_detail.ended");
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
      <div className={classes["event-match__time"]}>
        <span style={{ textTransform: "capitalize" }}>{clock}</span> <span>{period}</span>
      </div>
    );
  };

  return periodAndClock(props.match);
}

export default LiveMatchClockAndPeriod;
