import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import classes from "applications/ezbet/scss/ezbet.module.scss";

import "applications/ezbet/scss/sportradar-match-tracker-theme.scss";
import { getAuthIsIframe } from "../../../../../../../../redux/reselect/auth-selector";

import { useSelector } from "react-redux";

const LiveMatchTracker = ({ feedcode, hasData }) => {
  const isInIframe = useSelector(getAuthIsIframe);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollEffectActive, setScrollEffectActive] = useState(false);
  const [scrollEffectFixed, setScrollEffectFixed] = useState(false); // step into fixed position to force an animation
  const [scrollEffectMinimise, setScrollEffectMinimise] = useState(false);

  useEffect(() => {
    // make sure we do not end up with inconsistent data
    if (scrollEffectMinimise) setScrollEffectFixed(true);
  }, [scrollEffectMinimise]);

  useEffect(() => {
    const onScroll = (e) => {
      const newScrollTop = e.target.documentElement.scrollTop;

      setScrollTop(newScrollTop);
      setScrolling(newScrollTop > scrollTop);

      if (newScrollTop > 5) {
        // add active
        setScrollEffectActive(true);
        if (newScrollTop > scrollTop) {
          if (newScrollTop > 380) {
            // add scrolled
            setScrollEffectFixed(true);
            setTimeout(() => setScrollEffectMinimise(true), 100);
          }
        } else {
          // remove scrolled
          if (newScrollTop < 380) {
            setScrollEffectMinimise(false);
            setScrollEffectFixed(false);
            // setTimeout(() => setScrollEffectFixed(false), 300);
          }
        }
      } else {
        // remove active and scrolled...
        setScrollEffectActive(false);
        setScrollEffectMinimise(false);
        setScrollEffectFixed(false);
        // setTimeout(() => setScrollEffectFixed(false), 100);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  useEffect(() => {
    // if we run out of markets, force remove any minimised effect
    if (hasData) {
      setScrollTop(0);
      setScrolling(false);
      setScrollEffectMinimise(false);
      setScrollEffectFixed(false);
    }
  }, [hasData]);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (feedcode && window.SIR) {
      // call function loaded by BR Script Loader
      // SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {showOdds:false,scoreboard: "disable", momentum: "extended", matchId:35141045});
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        disableComponents: true,
        goalBannerImage: "https://ezprod.xyz/player/cms/assets/logos/1?originId=3&lineId=2",
        layout: "single",
        logo: ["https://ezprod.xyz/player/cms/assets/logos/1?originId=3&lineId=2"],
        logoLink: "/",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "extended",
        pitchLogo: "https://ezprod.xyz/player/cms/assets/logos/1?originId=3&lineId=2",
        scoreboard: "disable",
      });

      // call function loaded by BR Script Loader
      window.SIR("addWidget", ".sr-widget-2", "match.lmtPlus", {
        goalBannerImage: "https://ezprod.xyz/player/cms/assets/logos/1?originId=3&lineId=2",
        layout: "double",
        logo: ["https://ezprod.xyz/player/cms/assets/logos/1?originId=3&lineId=2"],
        logoLink: "/",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "disable",
        // pitchLogo: "https://ezprod.xyz/player/cms/image/532?originId=3&lineId=2",
        scoreboard: "disable",
      });
    }
  }, [feedcode]);

  return (
    <>
      <div>
        <div className="matchtracker widgets">
          <div className="sr-widget sr-widget-1" id="sr-widget" />
        </div>
      </div>

      <div
        className={cx(
          classes["match-tracker-animation"],
          { [classes["fixed"]]: scrollEffectFixed },
          { [classes["minimised"]]: scrollEffectMinimise },
          { [classes["iframe"]]: isInIframe },
        )}
        id={`mobile-match-tracker-${scrollEffectMinimise ? "minimised" : "regular"}`}
        style={{
          right: scrollEffectMinimise
            ? `${(window.innerWidth - document.getElementById("card-left").clientWidth) / 2}px`
            : "0px",
          width: scrollEffectMinimise ? `${document.getElementById("card-left").clientWidth * 0.75}px` : "100%",
        }}
      >
        <div className="matchtracker widgets">
          <div className="sr-widget sr-widget-2" id="sr-widget" />
        </div>
      </div>
    </>
  );
};

const propTypes = {
  feedcode: PropTypes.string.isRequired,
  hasData: PropTypes.bool.isRequired,
};

LiveMatchTracker.propTypes = propTypes;

export default React.memo(LiveMatchTracker);
