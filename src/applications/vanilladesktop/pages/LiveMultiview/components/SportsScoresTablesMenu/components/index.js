import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getLiveEuropeanDashboardData, getMultiviewEventIds } from "../../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../../redux/reselect/sport-selector";
import { setActiveMatchTracker, setMultiViewEventIds } from "../../../../../../../redux/slices/liveSlice";

import SportsScoresItem from "./SportsScoresItem";

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

const SportsScoresTablesMenu = ({ onDragStart }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const multiViewEventIdsStr = useSelector(getMultiviewEventIds);
  const multiViewEventIds =
    multiViewEventIdsStr.length > 0 ? multiViewEventIdsStr.split(",").map((x) => Number(x)) : [];

  const liveEuropeanData = useSelector(getLiveEuropeanDashboardData);
  const sports = useSelector(getSportsSelector);
  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);

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

  const onAddToMultiView = (eventId) => {
    if (multiViewEventIds.length < 8)
      dispatch(setMultiViewEventIds({ multiViewEventIds: [...new Set([...multiViewEventIds, eventId])] }));
  };

  return (
    <div className={classes["left-section__item"]}>
      <h3 className={classes["left-section__title"]}>{t("sports")}</h3>
      <div className={cx(classes["menu-sports"], classes["menu-sports_events"])}>
        <ul className={classes["menu-sports__list"]}>
          {liveEuropeanData &&
            Object.entries(liveEuropeanData).map((entry, index) => {
              // merge on top of the previous prematch "sports" object
              const sportCode = entry[0];
              const matches = Object.values(entry[1]).sort(compareLiveMatches);
              if (matches.length === 0) return null;

              return (
                <SportsScoresItem
                  autoExpanded={!index || matches.findIndex((x) => multiViewEventIds.includes(x.eventId)) > -1}
                  counter={matches.length}
                  icon={sportCode.toLowerCase()}
                  key={index}
                  label={sports ? sports[sportCode].description : ""}
                  matches={matches}
                  onAddToMultiView={onAddToMultiView}
                  onDragStart={onDragStart}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(SportsScoresTablesMenu);
