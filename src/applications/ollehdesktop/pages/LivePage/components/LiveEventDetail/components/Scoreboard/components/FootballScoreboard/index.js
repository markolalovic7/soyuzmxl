import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../../../../hooks/matchstatus-hooks";
import { getImg } from "../../../../../../../../../../utils/bannerHelpers";
import Jersey from "../../../../../../../../../common/components/Jersey/components";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";

const FootballScoreboard = ({
  aPeriodScores,
  aScore,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  countryDesc,
  eventId,
  hPeriodScores,
  hScore,
  icons,
  isOpAActive,
  isOpBActive,
  isPaused,
  leagueDesc,
  opADesc,
  opBDesc,
  sportCode,
}) => {
  const dispatch = useDispatch();
  const matchStatuses = useGetMatchStatuses(dispatch);

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

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
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : undefined),
    [cPeriod, matchStatuses],
  );

  if (!matchStatuses) return null;

  return (
    <div className={classes["live__scoreboard"]}>
      <div className={classes["live__scoreboard__img"]}>
        <img alt="sport" src={getImg(sportCode)} />
      </div>
      <div className={classes["live__scoreboard-subtitle"]}>
        <span className={cx(classes["qicon-foot"], classes["icon"])} />
        <p>
          <span>{countryDesc}</span>
          {` - ${leagueDesc}`}
        </p>
      </div>
      <div className={classes["live__totalscore"]}>
        <div className={classes["live__totalscore-logoleft"]}>
          <Jersey
            baseColor={icons?.a?.bc}
            countryCode={icons?.a?.cc}
            horizontalStripesColor={icons?.a?.hsc}
            jerseyNumberColor={undefined}
            shirtType={icons?.a?.st || (icons?.a?.cc && !icons?.a?.bc && "flag")}
            sleeveColor={icons?.a?.slc}
            sleeveDetailColor={icons?.a?.sdc}
            splitColor={icons?.a?.spc}
            squareColor={icons?.a?.sqc}
            verticalStripesColor={icons?.a?.vsc}
          />
        </div>
        <div className={`${classes["live__totalscore-name"]} ${classes["text-right"]}`}>{opADesc}</div>
        <div className={classes["live__totalscore-score"]}>
          <div className={classes["live__totalscore-number"]}>
            <span>{hScore}</span>
          </div>
          <div className={classes["live__totalscore-info"]}>
            <p className={classes["live__totalscore-time"]}>
              {cType !== MATCH_TYPE_NO_TIME ? `${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}` : ""}
            </p>
            <span className={classes["live__totalscore-period"]}>{currentPeriod}</span>
          </div>
          <div className={classes["live__totalscore-number"]}>
            <span>{aScore}</span>
          </div>
        </div>
        <div className={`${classes["live__totalscore-name"]} ${classes["text-left"]}`}>{opBDesc}</div>
        <div className={classes["live__totalscore-logoright"]}>
          <Jersey
            baseColor={icons?.b?.bc}
            countryCode={icons?.b?.cc}
            horizontalStripesColor={icons?.b?.hsc}
            jerseyNumberColor={undefined}
            shirtType={icons?.b?.st || (icons?.b?.cc && !icons?.b?.bc && "flag")}
            sleeveColor={icons?.b?.slc}
            sleeveDetailColor={icons?.b?.sdc}
            splitColor={icons?.b?.spc}
            squareColor={icons?.b?.sqc}
            verticalStripesColor={icons?.b?.vsc}
          />
        </div>
      </div>
      {/* <div className={classes["live__additionalinfo"]}> */}
      {/*  <div className={classes["live__additionalinfo-item"]}> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={YellowCardIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={RedCardIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={CornersIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={FoalsIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*  </div> */}
      {/*  <div className={classes["live__additionalinfo-item"]}> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={YellowCardIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={RedCardIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={CornersIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*    <div className={classes["live__additionalinfo-events"]}> */}
      {/*      <img alt="" src={FoalsIcon} /> */}
      {/*      <span>0</span> */}
      {/*    </div> */}
      {/*  </div> */}
      {/* </div> */}
    </div>
  );
};

const propTypes = {
  aPeriodScores: PropTypes.array.isRequired,
  aScore: PropTypes.number.isRequired,
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  countryDesc: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  hPeriodScores: PropTypes.array.isRequired,
  hScore: PropTypes.number.isRequired,
  icons: PropTypes.object,
  isOpAActive: PropTypes.bool.isRequired,
  isOpBActive: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  leagueDesc: PropTypes.string.isRequired,
  opADesc: PropTypes.string.isRequired,
  opBDesc: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  icons: undefined,
};

FootballScoreboard.propTypes = propTypes;
FootballScoreboard.defaultProps = defaultProps;

export default React.memo(FootballScoreboard);
