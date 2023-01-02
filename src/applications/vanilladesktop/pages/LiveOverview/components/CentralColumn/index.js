import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import { favouriteSelector, makeGetLiveEuropeanDashboardData } from "../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { setActiveMatchTracker } from "../../../../../../redux/slices/liveSlice";
import LiveSportDropdownPanel from "../LiveSportDropdownPanel";

// Sort `liveMatches` by `epDesc` and `opADesc`
function compareLiveMatches(liveMatchLeft, liveMatchRight) {
  if (liveMatchLeft.epDesc > liveMatchRight.epDesc) {
    return 1;
  }
  if (liveMatchLeft.epDesc < liveMatchRight.epDesc) {
    return -1;
  }
  if (liveMatchLeft.opADesc > liveMatchRight.opADesc) {
    return 1;
  }
  if (liveMatchLeft.opADesc < liveMatchRight.opADesc) {
    return -1;
  }

  return 0;
}
const CentralColumn = ({ activeSport }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);
  const liveFavourites = useSelector(favouriteSelector);
  const sports = useSelector(getSportsSelector);

  const getEuropeanDashboardLiveDataBySportCode = useMemo(() => makeGetLiveEuropeanDashboardData(), []);
  const liveEuropeanData = useSelector((state) =>
    getEuropeanDashboardLiveDataBySportCode(state, {
      sportCode: activeSport !== "ALL" ? activeSport : null,
    }),
  );

  // Mark the first available event for match tracker display
  useEffect(() => {
    if (!activeMatchTracker && liveEuropeanData && Object.keys(liveEuropeanData).length > 0) {
      const sportsEntries = Object.entries(liveEuropeanData);
      for (let i = 0; i < sportsEntries.length; i += 1) {
        const sport = sportsEntries[i][0];
        const matches = Object.values(sportsEntries[i][1])
          .filter((x) => x.hasMatchTracker)
          .sort(compareLiveMatches);
        if (matches.length > 0) {
          dispatch(setActiveMatchTracker({ feedCode: matches[0].feedCode, sportCode: sport }));
          break;
        }
      }
    }
  }, [activeMatchTracker, liveEuropeanData, setActiveMatchTracker]);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      {liveFavourites?.length === 0 && (
        <h4 className={classes["central-section__live-title"]} style={{ margin: "0px 0px 0px" }}>
          {t("vanilladesktop.your_favourite_is_empty_part_1")}
          <i className={classes["qicon-star-empty"]} />
          {t("vanilladesktop.your_favourite_is_empty_part_2")}
        </h4>
      )}
      {liveFavourites?.length > 0 && (
        <h3 className={cx(classes["main-title"], classes["main-title_live"])}>
          <p className={classes["main-title__text"]}>{t("my_favourites")}</p>
        </h3>
      )}
      <div className={classes["live-overview-spoilers"]}>
        {liveFavourites?.length > 0 &&
          liveEuropeanData &&
          Object.entries(liveEuropeanData).map((entry) => {
            // merge on top of the previous prematch "sports" object
            const sportCode = entry[0];
            const matches = Object.values(entry[1])
              .filter((m) => liveFavourites.includes(m.eventId))
              .sort(compareLiveMatches);
            if (matches.length === 0) return null;

            return (
              <LiveSportDropdownPanel
                autoExpanded
                icon={sportCode.toLowerCase()}
                key={sportCode}
                label={sports ? sports[sportCode].description : ""}
                matches={matches}
              />
            );
          })}
      </div>
      <div className={classes["central-section__content"]}>
        <h3 className={cx(classes["main-title"], classes["main-title_live"])}>
          <p className={classes["main-title__text"]}>{t("vanilla_sports_tabs.live_sports")}</p>
        </h3>
        <div className={classes["live-overview-spoilers"]}>
          {liveEuropeanData &&
            Object.entries(liveEuropeanData).map((entry, index) => {
              // merge on top of the previous prematch "sports" object
              const sportCode = entry[0];
              const matches = Object.values(entry[1])
                .filter((m) => !liveFavourites.includes(m.eventId))
                .sort(compareLiveMatches);
              if (matches.length === 0) return null;

              return (
                <LiveSportDropdownPanel
                  autoExpanded={!index}
                  icon={sportCode.toLowerCase()}
                  key={sportCode}
                  label={sports ? sports[sportCode].description : ""}
                  matches={matches}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

CentralColumn.propTypes = {
  activeSport: PropTypes.string.isRequired,
};
CentralColumn.defaultProps = {};
export default React.memo(CentralColumn);
