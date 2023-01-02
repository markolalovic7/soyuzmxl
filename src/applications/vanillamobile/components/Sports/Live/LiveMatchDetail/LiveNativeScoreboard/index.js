import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../hooks/matchstatus-hooks";
import Jersey from "../../../../../../common/components/Jersey/components";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../common/components/LiveEuropeanMatch/constants";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  aPeriodScores: PropTypes.array.isRequired,
  aScore: PropTypes.number.isRequired,
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  hPeriodScores: PropTypes.array.isRequired,
  hScore: PropTypes.number.isRequired,
  icons: PropTypes.object,
  isOpAActive: PropTypes.bool.isRequired,
  isOpBActive: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  opADesc: PropTypes.string.isRequired,
  opBDesc: PropTypes.string.isRequired,
};

const defaultProps = {
  icons: undefined,
};

const LiveNativeScoreboard = ({
  aPeriodScores,
  aScore,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  eventId,
  hPeriodScores,
  hScore,
  icons,
  isOpAActive,
  isOpBActive,
  isPaused,
  opADesc,
  opBDesc,
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
    <div style={{ display: "block", padding: "0px 0px 0px 0px" }}>
      <div className={classes["match-board"]}>
        <span className={classes["match-board__time"]}>
          {currentPeriod}
          {cType !== MATCH_TYPE_NO_TIME ? ` | ${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}` : ""}
        </span>
        <div className={classes["match-board__row"]}>
          <div className={classes["match-board__team"]}>
            <div className={classes["match-board__team-form"]}>
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
            <div className={classes["match-board__team-name"]}>
              <span>{opADesc}</span>
            </div>
          </div>
          <div className={classes["match-board__score"]}>{`${hScore} : ${aScore}`}</div>
          <div className={classes["match-board__team"]}>
            <div className={classes["match-board__team-form"]}>
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
            <div className={classes["match-board__team-name"]}>
              <span>{opBDesc}</span>
            </div>
          </div>
        </div>
        <div className={classes["match-board__table"]}>
          <div className={classes["match-board__top"]}>
            <div className={classes["match-board__labels"]}>
              {hPeriodScores.map((periodScore, index) => (
                <div className={classes["match-board__label"]} key={index}>
                  {index + 1}
                </div>
              ))}
            </div>
            <div className={classes["match-board__counting"]}>
              <div className={classes["match-board__count"]}>t</div>
            </div>
          </div>
          <div className={classes["match-board__body"]}>
            <div className={classes["match-board__matches"]}>
              <div className={classes["match-board__teams"]}>
                <div className={classes["match-board__match-team"]}>{opADesc}</div>
                <div className={classes["match-board__match-team"]}>{opBDesc}</div>
              </div>
              {hPeriodScores.length > 1 && (
                <div className={classes["match-board__cells"]}>
                  <div className={classes["match-board__cells-top"]}>
                    {hPeriodScores.slice(0, hPeriodScores.length - 1).map((periodScore, index) => (
                      <div
                        className={cx(
                          classes["match-board__cell"],
                          {
                            [classes["match-board__cell_bold"]]: periodScore > aPeriodScores[index],
                          },
                          {
                            [classes["current"]]: index === hPeriodScores.length - 1,
                          },
                        )}
                        key={index}
                      >
                        {periodScore}
                      </div>
                    ))}
                  </div>
                  <div className={classes["match-board__cells-bottom"]}>
                    {aPeriodScores.slice(0, aPeriodScores.length - 1).map((periodScore, index) => (
                      <div
                        className={cx(
                          classes["match-board__cell"],
                          {
                            [classes["match-board__cell_bold"]]: periodScore > hPeriodScores[index],
                          },
                          {
                            [classes["current"]]: index === aPeriodScores.length - 1,
                          },
                        )}
                        key={index}
                      >
                        {periodScore}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hPeriodScores.length > 0 && (
                <div className={cx(classes["match-board__cells"], classes["match-board__cells_special"])}>
                  <div className={classes["match-board__cells-top"]}>
                    <div className={cx(classes["match-board__cell"], classes["match-board__cell_bold"])}>
                      {hPeriodScores[hPeriodScores.length - 1]}
                    </div>
                  </div>
                  <div className={classes["match-board__cells-bottom"]}>
                    <div className={cx(classes["match-board__cell"], classes["match-board__cell_bold"])}>
                      {aPeriodScores[aPeriodScores.length - 1]}
                    </div>
                  </div>
                </div>
              )}
              <div className={classes["match-board__countings"]}>
                <div className={classes["match-board__count"]}>{hScore}</div>
                <div className={classes["match-board__count"]}>{aScore}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LiveNativeScoreboard.propTypes = propTypes;
LiveNativeScoreboard.defaultProps = defaultProps;

export default React.memo(LiveNativeScoreboard);
