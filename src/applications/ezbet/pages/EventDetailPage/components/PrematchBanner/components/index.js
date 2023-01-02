import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthIsIframe } from "../../../../../../../redux/reselect/auth-selector";

import SportIcon from "applications/ezbet/components/SportIcon/SportIcon";
import classes from "applications/ezbet/scss/ezbet.module.scss";
import { EarthIconSVG } from "applications/ezbet/utils/icon-utils";

const PrematchBanner = ({
  countryCodeA,
  countryCodeB,
  eventCount,
  eventPathDesc,
  eventPathId,
  oppA,
  oppB,
  sportCode,
  startTime,
}) => {
  const history = useHistory();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollEffectMinimise, setScrollEffectMinimise] = useState(false);

  const isInIframe = useSelector(getAuthIsIframe);

  useEffect(() => {
    const onScroll = (e) => {
      const newScrollTop = e.target.documentElement.scrollTop;
      setScrollTop(newScrollTop);
      setScrolling(newScrollTop > scrollTop);

      if (newScrollTop > 165) {
        setScrollEffectMinimise(true);
      } else {
        // remove active and scrolled...
        setScrollEffectMinimise(false);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  return (
    <>
      <section className={cx(classes["filter-wrapper"], classes["filter-wrapper-double-left"])}>
        <div className={classes["left"]}>
          <i
            className={classes["icon-double-left2"]}
            onClick={() => history.push(`/prematch/sport/${sportCode}/eventpath/${eventPathId}`)}
          />
          <div className={cx(classes["sport-iconx-active"])}>
            <SportIcon code={sportCode} />
          </div>
          <div className={classes["flex-center"]}>
            <p>{eventPathDesc}</p>
            &nbsp;
            <span className={classes["league-name-count"]}>{eventCount ? `( ${eventCount} )` : ""}</span>
          </div>
        </div>
      </section>
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
        id={`mobile-match-banner-${scrollEffectMinimise ? "minimised" : "regular"}`}
        style={{
          left: !scrollEffectMinimise ? "0px" : document.getElementById("card-left").getBoundingClientRect().left,
        }}
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

PrematchBanner.propTypes = {
  countryCodeA: PropTypes.string.isRequired,
  countryCodeB: PropTypes.string.isRequired,
  eventCount: PropTypes.number.isRequired,
  eventPathDesc: PropTypes.string.isRequired,
  eventPathId: PropTypes.number.isRequired,
  oppA: PropTypes.string.isRequired,
  oppB: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
  startTime: PropTypes.object.isRequired,
};

export default React.memo(PrematchBanner);
