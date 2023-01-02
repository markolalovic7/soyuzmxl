import React, { useEffect } from "react";
import "../../../../scss/sportradar-match-tracker-theme.scss";

const LiveMatchTracker = (props) => {
  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (props.feedcode && window.SIR) {
      // call function loaded by BR Script Loader
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        goalBannerImage: "https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2",
        layout: "double",
        logo: ["https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2"],
        logoLink: "/",
        matchId: props.feedcode.substring(props.feedcode.lastIndexOf(":") + 1, props.feedcode.length),
        momentum: "extended",
        pitchLogo: "https://hbprod.xyz/player/cms/assets/logos/17?originId=3&lineId=2",
        scoreboard: "enabled",
      });
    }
  }, [props.feedcode]);

  return (
    <div className="matchtracker widgets">
      <div className="sr-widget sr-widget-1" id="sr-widget" />
    </div>
  );
};

export default React.memo(LiveMatchTracker);
