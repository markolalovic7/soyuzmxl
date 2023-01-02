import { createSelector } from "@reduxjs/toolkit";
import { isNotEmpty } from "utils/lodash";

export const getLiveEuropeanDashboardData = createSelector(
  (state) => state.live?.liveData,
  (liveData) => (liveData ? liveData["european-dashboard"] : null),
);

/**
 * returns all european live dashboard data, filtered by a sport code and / or an event path Id (can be a country or league)
 * */
export function makeGetLiveEuropeanDashboardData() {
  return createSelector(
    getLiveEuropeanDashboardData,
    (_, props) => props.sportCode,
    (_, props) => props.eventPathIds,
    (liveData, sportCode, eventPathIds) => {
      if (liveData) {
        let filteredLiveData = { ...liveData };
        if (sportCode) {
          // keep only the relevant sport
          filteredLiveData = {};
          filteredLiveData[sportCode] = liveData[sportCode];
        }

        if (eventPathIds && eventPathIds.length > 0) {
          // keep only the relevent event path data
          const eventPathFilteredLiveData = {};
          for (let i = 0; i < Object.keys(filteredLiveData).length; i += 1) {
            const sportCodeAux = Object.keys(filteredLiveData)[i];
            if (filteredLiveData[sportCodeAux]) {
              const sportLiveMatches = Object.values(filteredLiveData[sportCodeAux]).filter(
                (match) => eventPathIds.includes(match.leagueId) || eventPathIds.includes(match.countryId),
              );
              if (sportLiveMatches.length > 0) {
                eventPathFilteredLiveData[sportCodeAux] = sportLiveMatches;
                break; // we found the candidate, no other sport will meet the requirement, exit now
              }
            }
          }
          filteredLiveData = eventPathFilteredLiveData;
        }

        return filteredLiveData;
      }

      return null;
    },
  );
}

export function makeGetEuropeanDashboardLiveDataBySportCode() {
  return createSelector(
    getLiveEuropeanDashboardData,
    (_, props) => props.sportCode,
    (liveData, sportCode) => (isNotEmpty(liveData) ? liveData[sportCode] : []),
  );
}

export const favouriteSelector = createSelector(
  (state) => state.live.liveFavourites,
  (favourites) => favourites.map((f) => f.eventId),
);

export const getMultiviewEventIds = createSelector(
  (state) => state.live?.multiViewEventIds,
  getLiveEuropeanDashboardData,
  (eventIds, liveData) => {
    // filter any garbage no longer active.
    const activeEventIds = [];
    if (liveData) {
      Object.values(liveData).forEach((matches) => {
        Object.values(matches).forEach((match) => {
          activeEventIds.push(match.eventId);
        });
      });
    }

    // return as string to avoid reselect not realizing the arrays are the same and triggering updates
    return eventIds.filter((eventId) => activeEventIds.includes(eventId)).join(",");
  },
);
