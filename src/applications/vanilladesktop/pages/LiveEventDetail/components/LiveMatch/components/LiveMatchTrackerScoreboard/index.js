import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const LiveMatchTrackerScoreboard = ({ matchTrackerWidget }) => {
  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (activeMatchTracker?.feedCode && matchTrackerWidget?.data?.mode === "BETRADAR" && window.SIR) {
      const feedcode = activeMatchTracker.feedCode;

      // call function loaded by BR Script Loader
      // window.SIR("addWidget", ".sr-widget-scoreboard", "match.lmtPlus", {layout: "double", scoreboard: "enable", momentum: "extended", pitchLogo: "https://demosite888.com/cmscontent/image/402", goalBannerImage: "https://demosite888.com/cmscontent/image/402", logo:["https://demosite888.com/cmscontent/image/402"],logoLink: "www.google.com", matchId: feedcode.substring(feedcode.lastIndexOf(':') + 1, feedcode.length)});
      window.SIR("addWidget", ".sr-widget-scoreboard", "match.lmtPlus", {
        detailedScoreboard: "disable",
        disableComponents: true,
        goalBannerImage: "https://demosite888.com/cmscontent/image/402",
        logo: ["https://demosite888.com/cmscontent/image/402"],
        logoLink: "www.google.com",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        pitchLogo: "https://demosite888.com/cmscontent/image/402",
        scoreboard: "extended",
      });
      // console.log('Match tracker invoked in 5 secs...');
      //  setTimeout(() => window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {layout: "double", scoreboard: "disable", momentum: "extended", pitchLogo: "https://demosite888.com/cmscontent/image/402", goalBannerImage: "https://demosite888.com/cmscontent/image/402", logo:["https://demosite888.com/cmscontent/image/402"],logoLink: "www.google.com", matchId: feedcode.substring(feedcode.lastIndexOf(':') + 1, feedcode.length)}), 5000);
    }
  }, [activeMatchTracker, matchTrackerWidget]);

  if (!activeMatchTracker) return null;
  if (!matchTrackerWidget?.data?.sports?.includes(activeMatchTracker.sportCode)) return null;

  return (
    <div className="widgets">
      <div className="sr-widget sr-widget-scoreboard" id="sr-widget" />
    </div>
  );
};

LiveMatchTrackerScoreboard.propTypes = {
  matchTrackerWidget: PropTypes.object,
};
LiveMatchTrackerScoreboard.defaultProps = {
  matchTrackerWidget: undefined,
};

export default React.memo(LiveMatchTrackerScoreboard);
