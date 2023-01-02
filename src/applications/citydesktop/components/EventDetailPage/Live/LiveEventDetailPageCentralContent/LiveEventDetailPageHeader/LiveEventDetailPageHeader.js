import React from "react";

import classes from "../../../../../scss/citywebstyle.module.scss";
import { getBackgroundImageByCode } from "../../../Prematch/PrematchEventDetailPageCentralContent/PrematchEventDetailPageHeader/utils";

import LiveMatchClockAndPeriod from "./LiveMatchClockAndPeriod";

const LiveEventDetailPageHeader = (props) => (
  <div
    className={classes["event-match"]}
    style={{ background: `url(${getBackgroundImageByCode(props.match.sport)}) 100%/cover no-repeat` }}
  >
    <div className={classes["event-match__container"]}>
      <div className={`${classes["event-match__team"]} ${classes["event-match__team_first"]}`}>
        <span>{props.match.opADesc}</span>
      </div>
      <div className={classes["event-match__date"]}>
        <span className={classes["event-match__club"]}>{props.match.epDesc}</span>
        <span className={classes["event-match__score"]}>
          {props.match.hScore && props.match.aScore ? `${props.match.hScore}:${props.match.aScore}` : ""}
        </span>
        <LiveMatchClockAndPeriod match={props.match} />
      </div>
      <div className={`${classes["event-match__team"]} ${classes["event-match__team_second"]}`}>
        <span>{props.match.opBDesc}</span>
      </div>
    </div>
  </div>
);

export default React.memo(LiveEventDetailPageHeader);
