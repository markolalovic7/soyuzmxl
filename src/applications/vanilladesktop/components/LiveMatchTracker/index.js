import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import "applications/vanilladesktop/scss/sportradar-match-tracker-theme.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const propTypes = {
  matchTrackerWidget: PropTypes.object.isRequired,
};
const defaultProps = {};

const LiveMatchTracker = ({ matchTrackerWidget }) => {
  const { t } = useTranslation();

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (activeMatchTracker?.feedCode && matchTrackerWidget?.mode === "BETRADAR" && window.SIR) {
      const feedcode = activeMatchTracker.feedCode;

      // call function loaded by BR Script Loader (see LiveCoupon)
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        goalBannerImage: "https://demosite888.com/cmscontent/image/402",
        layout: "topdown",
        logo: ["https://demosite888.com/cmscontent/image/402"],
        logoLink: "www.google.com",
        matchId: feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length),
        momentum: "extended",
        pitchLogo: "https://demosite888.com/cmscontent/image/402",
        scoreboard: "extended",
      });
    }
  }, [activeMatchTracker, matchTrackerWidget]);

  if (!activeMatchTracker) return null;
  if (!matchTrackerWidget?.sports?.includes(activeMatchTracker.sportCode)) return null;

  return (
    <div className={classes["match-tracker"]}>
      <h3 className={classes["match-tracker__title"]}>{t("match_tracker")}</h3>
      <div className={classes["match-tracker__body"]}>
        <div className="widgets">
          <div>
            <div className="sr-widget sr-widget-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

LiveMatchTracker.propTypes = propTypes;
LiveMatchTracker.defaultProps = defaultProps;

export default React.memo(LiveMatchTracker);
