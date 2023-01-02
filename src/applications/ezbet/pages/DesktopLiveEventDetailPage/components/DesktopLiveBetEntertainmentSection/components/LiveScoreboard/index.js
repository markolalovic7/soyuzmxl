import PropTypes from "prop-types";
import React, { useEffect } from "react";
import "applications/ezbet/scss/sportradar-match-tracker-theme.scss";

const LiveScoreboard = ({ feedcode }) => {
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
    }
  }, [feedcode]);

  return (
    <div>
      <div className="matchtracker widgets">
        <div className="sr-widget sr-widget-1" id="sr-widget" />
      </div>
    </div>
  );
};

const propTypes = {
  feedcode: PropTypes.string.isRequired,
};

LiveScoreboard.propTypes = propTypes;

export default React.memo(LiveScoreboard);
