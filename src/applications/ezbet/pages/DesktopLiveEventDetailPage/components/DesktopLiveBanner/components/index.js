import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthIsIframe } from "../../../../../../../redux/reselect/auth-selector";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { EarthIconSVG } from "applications/ezbet/utils/icon-utils";

const DesktopLiveBanner = ({
  cMin,
  cSec,
  cStatus,
  cType,
  countryCodeA,
  countryCodeB,
  oppA,
  oppB,
  period,
  scoreA,
  scoreB,
  scrollEffectMinimise,
}) => {
  const history = useHistory();

  const isInIframe = useSelector(getAuthIsIframe);

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

  return (
    <>
      <section
        className={cx(
          classes["match-banner"],
          classes["match-banner-live"],
          classes["relative"],
          {
            [classes["match-banner-compressed"]]: scrollEffectMinimise,
          },
          {
            [classes["iframe"]]: isInIframe,
          },
        )}
      >
        <h2>
          <span>{period}</span>
          {cType !== MATCH_TYPE_NO_TIME ? (
            <span>
              {`0${min}`.slice(-2)}:{`0${sec}`.slice(-2)}
            </span>
          ) : (
            ""
          )}
        </h2>
        <div className={classes["match-highlighted"]}>
          <div className={classes["team-and-score-left"]}>
            <div className={classes["team-left"]}>
              {countryCodeA ? (
                <ReactCountryFlag svg countryCode={countryCodeA} />
              ) : (
                <i>
                  <EarthIconSVG />
                </i>
              )}
              <p>{oppA}</p>
            </div>
            <div className={classes["home-score"]}>
              <p>{scoreA}</p>
            </div>
          </div>
          <span>
            <div>
              <small>{period}</small>
              {cType !== MATCH_TYPE_NO_TIME ? (
                <>
                  &nbsp;
                  <small>
                    {`0${min}`.slice(-2)}:{`0${sec}`.slice(-2)}
                  </small>
                </>
              ) : (
                ""
              )}
            </div>
            <span className={classes["vs"]}>VS</span>
          </span>
          <div className={classes["team-and-score-right"]}>
            <div className={classes["team-right"]}>
              <div className={classes["away-score"]}>
                <p>{scoreB}</p>
              </div>
              <p>{oppB}</p>
              {countryCodeB ? (
                <ReactCountryFlag svg countryCode={countryCodeB} />
              ) : (
                <i>
                  <EarthIconSVG />
                </i>
              )}
            </div>
          </div>
        </div>
        <div className={classes["absolute"]}>
          <span className={classes["icon-lines2"]} />
        </div>
      </section>
      {scrollEffectMinimise && <div style={{ height: "110px" }} />}
    </>
  );
};

DesktopLiveBanner.propTypes = {
  cMin: PropTypes.number,
  cSec: PropTypes.number,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  countryCodeA: PropTypes.string,
  countryCodeB: PropTypes.string,
  oppA: PropTypes.string.isRequired,
  oppB: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  scoreA: PropTypes.string.isRequired,
  scoreB: PropTypes.string.isRequired,
  scrollEffectMinimise: PropTypes.bool.isRequired,
};

DesktopLiveBanner.defaultProps = {
  cMin: undefined,
  cSec: undefined,
  countryCodeA: undefined,
  countryCodeB: undefined,
};

export default React.memo(DesktopLiveBanner);
