import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import classes from "applications/ezbet/scss/ezbet.module.scss";

import "applications/ezbet/scss/sportradar-match-tracker-theme.scss";
import { getAuthIsIframe } from "../../../../../../../../redux/reselect/auth-selector";

import { useSelector } from "react-redux";

const LiveMatchTracker = ({ feedcode, scrollEffectFixed, scrollEffectMinimise }) => {
  const isInIframe = useSelector(getAuthIsIframe);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (feedcode && window.SIR) {
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
    <div
      className={cx(
        classes["match-tracker-animation"],
        { [classes["fixed"]]: scrollEffectFixed },
        { [classes["minimised"]]: scrollEffectMinimise },
        { [classes["iframe"]]: isInIframe },
      )}
    >
      <div className="matchtracker widgets">
        <div className="sr-widget sr-widget-2" id="sr-widget" />
      </div>
    </div>
  );
};

const propTypes = {
  feedcode: PropTypes.string.isRequired,
  scrollEffectFixed: PropTypes.bool.isRequired,
  scrollEffectMinimise: PropTypes.bool.isRequired,
};

LiveMatchTracker.propTypes = propTypes;

export default React.memo(LiveMatchTracker);
