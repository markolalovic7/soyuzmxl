import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthIsIframe } from "../../../../../../../redux/reselect/auth-selector";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { EarthIconSVG } from "applications/ezbet/utils/icon-utils";

const DesktopPrematchBanner = ({ countryCodeA, countryCodeB, oppA, oppB, scrollEffectMinimise, startTime }) => {
  const history = useHistory();

  const isInIframe = useSelector(getAuthIsIframe);

  return (
    <>
      <section
        className={cx(
          classes["match-banner"],
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
          <span>{startTime.format("dddd")}</span>
          <span>{startTime.format("MM-DD")}</span>
          <span>{startTime.format("HH:mm")}</span>
        </h2>
        <div className={classes["match-highlighted"]}>
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
          <span>
            <div>
              <small>{startTime.format("MM-DD")}</small>
              &nbsp;
              <small>{startTime.format("HH:mm")}</small>
            </div>
            <span className={classes["vs"]}>VS</span>
          </span>
          <div className={classes["team-right"]}>
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
        <div className={classes["absolute"]}>
          <span className={classes["icon-lines2"]} />
        </div>
      </section>
      {scrollEffectMinimise && <div style={{ height: "110px" }} />}
    </>
  );
};

DesktopPrematchBanner.propTypes = {
  countryCodeA: PropTypes.string.isRequired,
  countryCodeB: PropTypes.string.isRequired,
  oppA: PropTypes.string.isRequired,
  oppB: PropTypes.string.isRequired,
  scrollEffectMinimise: PropTypes.bool.isRequired,
  startTime: PropTypes.object.isRequired,
};

export default React.memo(DesktopPrematchBanner);
