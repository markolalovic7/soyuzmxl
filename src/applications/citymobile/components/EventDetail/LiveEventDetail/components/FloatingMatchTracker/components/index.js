import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import classes from "../../../../../../scss/citymobile.module.scss";
import "../../../../../../scss/sportradar-match-tracker-theme.scss";

const FloatingMatchTracker = ({ feedcode }) => {
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollEffectActive, setScrollEffectActive] = useState(false);
  const [scrollEffectMinimise, setScrollEffectMinimise] = useState(false);

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
            setScrollEffectMinimise(true);
          }
        } else {
          // remove scrolled
          if (newScrollTop < 150) {
            setScrollEffectMinimise(false);
          }
        }
      } else {
        // remove active and scrolled...
        setScrollEffectActive(false);
        setScrollEffectMinimise(false);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (feedcode && window.SIR) {
      // call function loaded by BR Script Loader
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        detailedScoreboard: "disable",
        disableComponents: true,
        goalBannerImage: "https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2",
        layout: "single",
        logo: ["https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2"],
        logoLink: "/",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "disable",
        pitchLogo: "https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2",
        scoreboard: "extended",
      });

      // call function loaded by BR Script Loader
      window.SIR("addWidget", ".sr-widget-2", "match.lmtPlus", {
        goalBannerImage: "https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2",
        layout: "double",
        logo: ["https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2"],
        logoLink: "/",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "disable",
        // pitchLogo: "https://hbprod.xyz/player/cms/image/532?originId=3&lineId=2",
        scoreboard: "disable",
      });
    }
  }, [feedcode]);

  return (
    <>
      <div className={classes["score"]}>
        <div className="matchtracker widgets">
          <div className="sr-widget sr-widget-1" id="sr-widget" />
        </div>
      </div>

      <div
        className={`${classes["event-schema"]} ${scrollEffectActive ? classes["active"] : ""} ${
          scrollEffectMinimise ? classes["scrolled"] : ""
        } `}
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
};

FloatingMatchTracker.propTypes = propTypes;

export default React.memo(FloatingMatchTracker);
