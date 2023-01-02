import * as PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { getLiveEuropeanDashboardData } from "../../../../../../../redux/reselect/live-selector";
import { getHighlightEventPathIds } from "../../../../../../../utils/highlight-utils";
import classes from "../../../../../scss/citymobile.module.scss";

const SIX_HOUR_CACHE_KEY = "6_HOUR";

const combinedSportsList = (
  sports,
  prematchOn,
  liveOn,
  highlightsOn,
  dateToIndex,
  sportsTreeData,
  sixHoursSportsTreeData,
  europeanDashboardLiveData,
) => {
  let sportsList = [];
  const cmsConfig = useSelector((state) => state.cms.config);

  const sportsTreeDataBaseline = dateToIndex % 1 === 0 ? sportsTreeData : sixHoursSportsTreeData;

  if (prematchOn && sportsTreeDataBaseline && sportsTreeDataBaseline.ept) {
    const prematchSports = sportsTreeDataBaseline.ept.map((sport) => {
      let eventCount = 0;

      if (highlightsOn) {
        const cmsPaths = getHighlightEventPathIds(cmsConfig, sport.code);
        sport.path.forEach((countryPath) => {
          if (cmsPaths.includes(parseInt(countryPath.id, 10))) {
            const liveEventCount = countryPath.criterias.live;
            eventCount += countryPath.eventCount - (liveEventCount || 0);
          } else {
            countryPath.path.forEach((tournamentPath) => {
              if (cmsPaths.includes(parseInt(tournamentPath.id, 10))) {
                const liveEventCount = tournamentPath.criterias.live;
                eventCount += tournamentPath.eventCount - (liveEventCount || 0);
              }
            });
          }
        });
      } else if (dateToIndex === 0) {
        eventCount = sport.criterias["d0"] ? sport.criterias["d0"] : 0;
      } else if (dateToIndex > 0 && dateToIndex < 1) {
        eventCount =
          (sport.criterias["d0"] ? sport.criterias["d0"] : 0) + (sport.criterias["d1"] ? sport.criterias["d1"] : 0);
      }

      if (eventCount === 0) return null;

      return { code: sport.code, desc: sport.desc, eventCount };
    });
    sportsList = sportsList.concat(prematchSports.filter((f) => f));
  }

  if (liveOn && europeanDashboardLiveData) {
    Object.entries(europeanDashboardLiveData).forEach((entry) => {
      // merge on top of the previous prematch "sportsList" object
      const sportCode = entry[0];
      const matches = Object.values(entry[1]).filter((match) => match.cStatus !== "END_OF_EVENT");

      const existingSport = sportsList.find((sport) => sport.code === sportCode);
      if (existingSport) {
        existingSport.eventCount += matches.length;
      } else if (matches.length > 0) {
        sportsList.push({
          code: sportCode,
          desc: sports ? sports[sportCode].description : sportCode,
          eventCount: matches.length,
        });
      }
    });
  }

  return sportsList;
};

const SportSelector = ({ activeSport, dateToIndex, highlightsOn, liveOn, prematchOn, setActiveSport }) => {
  const sports = useSelector((state) => state.sport.sports);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sixHoursSportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[SIX_HOUR_CACHE_KEY] : undefined,
  );

  const europeanDashboardLiveData = useSelector(getLiveEuropeanDashboardData);

  const combinedSports = combinedSportsList(
    sports,
    prematchOn,
    liveOn,
    highlightsOn,
    dateToIndex,
    sportsTreeData,
    sixHoursSportsTreeData,
    europeanDashboardLiveData,
  );

  useEffect(() => {
    if (combinedSports.length > 0 && (!activeSport || combinedSports.findIndex((s) => s.code === activeSport) === -1)) {
      // init the sport selection to the first one...
      setActiveSport(combinedSports[0].code);
    }
  }, [combinedSports]);

  return (
    <div className={classes["links"]}>
      {(!prematchOn || sportsTreeData) &&
        (!liveOn || europeanDashboardLiveData) &&
        combinedSports.map((sport) => (
          <div
            className={`${classes["links__item"]} ${activeSport === sport.code ? classes["links__item_active"] : ""}`}
            key={sport.code}
            onClick={() => setActiveSport(sport.code)}
          >
            <span>{sport.desc}</span>
            <span>{sport.eventCount}</span>
          </div>
        ))}
    </div>
  );
};

const propTypes = {
  activeSport: PropTypes.string,
  dateToIndex: PropTypes.number,
  highlightsOn: PropTypes.bool.isRequired,
  liveOn: PropTypes.bool.isRequired,
  prematchOn: PropTypes.bool.isRequired,
  setActiveSport: PropTypes.func.isRequired,
};

const defaultProps = {
  activeSport: undefined,
  dateToIndex: undefined,
};

SportSelector.propTypes = propTypes;
SportSelector.defaultProps = defaultProps;

export default React.memo(SportSelector);
