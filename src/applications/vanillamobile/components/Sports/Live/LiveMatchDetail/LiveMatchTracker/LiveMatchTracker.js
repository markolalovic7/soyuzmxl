import PropTypes from "prop-types";
import React, { useEffect } from "react";

const propTypes = {
  feedcode: PropTypes.string,
  matchTrackerWidget: PropTypes.object,
};
const defaultProps = {
  feedcode: undefined,
  matchTrackerWidget: undefined,
};

const LiveMatchTracker = ({ feedcode, matchTrackerWidget }) => {
  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (feedcode && matchTrackerWidget?.data?.mode === "BETRADAR" && window.SIR) {
      // call function loaded by BR Script Loader
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        goalBannerImage: "https://demosite888.com/cmscontent/image/402",
        layout: "double",
        logo: ["https://demosite888.com/cmscontent/image/402"],
        logoLink: "www.google.com",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "extended",
        pitchLogo: "https://demosite888.com/cmscontent/image/402",
        scoreboard: "disable",
      });

      // console.log('Match tracker invoked in 5 secs...');
      //  setTimeout(() => window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {layout: "double", scoreboard: "disable", momentum: "extended", pitchLogo: "https://demosite888.com/cmscontent/image/402", goalBannerImage: "https://demosite888.com/cmscontent/image/402", logo:["https://demosite888.com/cmscontent/image/402"],logoLink: "www.google.com", matchId: feedcode.substring(feedcode.lastIndexOf(':') + 1, feedcode.length)}), 5000);
    }
  }, [feedcode, matchTrackerWidget?.data?.mode]);

  return (
    <div className="widgets">
      <div className="sr-widget sr-widget-1" id="sr-widget" />
    </div>
  );
};

LiveMatchTracker.propTypes = propTypes;
LiveMatchTracker.defaultProps = defaultProps;

export default React.memo(LiveMatchTracker);
