import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getLiveEuropeanDashboardData } from "../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";

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

const SportsScoresTablesMenu = ({ activeEventId, onSelectMatch }) => {
  const { t } = useTranslation();
  const liveEuropeanData = useSelector(getLiveEuropeanDashboardData);
  const sports = useSelector(getSportsSelector);

  // Mark the first available event for match tracker display
  useEffect(() => {
    if (!activeEventId && liveEuropeanData && Object.keys(liveEuropeanData).length > 0) {
      const eventIds = Object.entries(liveEuropeanData)
        .map((entry) => {
          const matches = Object.values(entry[1]).sort(compareLiveMatches);
          if (matches.length > 0) {
            return matches[0].eventId;
          }

          return undefined;
        })
        .filter((m) => m);
      if (eventIds.length > 0) onSelectMatch(eventIds[0]);
    }
  }, [activeEventId, liveEuropeanData, onSelectMatch]);

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
                  activeEventId={activeEventId}
                  autoExpanded={!index || matches.findIndex((x) => x.eventId === activeEventId) > -1}
                  counter={matches.length}
                  icon={sportCode.toLowerCase()}
                  key={index}
                  label={sports ? sports[sportCode].description : ""}
                  matches={matches}
                  onSelectMatch={onSelectMatch}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

SportsScoresTablesMenu.propTypes = {
  activeEventId: PropTypes.number,
  onSelectMatch: PropTypes.func.isRequired,
};

SportsScoresTablesMenu.defaultProps = {
  activeEventId: undefined,
};

export default React.memo(SportsScoresTablesMenu);
