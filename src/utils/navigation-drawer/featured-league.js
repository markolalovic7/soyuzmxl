import { isDefined } from "utils/lodash";
import { getSortedFeaturedLeagues } from "utils/sort/navigation-drawer-featured-league-sort";

function findByEventPathId(eventPathId) {
  const searchFunc = (acc, sportTreeDataItem) => {
    const path = sportTreeDataItem.path || [];
    if (acc) {
      return acc;
    }

    return sportTreeDataItem.id === eventPathId ? sportTreeDataItem.criterias : path.reduce(searchFunc, null);
  };

  return searchFunc;
}

export function getFeaturedLeagueItems(featuredLeagueItems, sportTreeData) {
  return getSortedFeaturedLeagues(
    featuredLeagueItems
      .map((featuredLeagueItem) => {
        // Note: Find `sportLeague` by `sportCode` for each `featuredLeagueItem`.
        const sportLeague = sportTreeData.find(
          (sportTreeDataItem) => sportTreeDataItem.code === featuredLeagueItem.sportCode,
        );
        if (!sportLeague) {
          return undefined;
        }
        // Note: Search for each `sportLeague` recursively to find `event` by `eventPathId`.
        const event = sportLeague.path.reduce(findByEventPathId(featuredLeagueItem.eventPathId), null);
        if (!event) {
          return undefined;
        }

        return { ...featuredLeagueItem, live: isDefined(event.live) };
      })
      .filter((featuredLeagueItem) => isDefined(featuredLeagueItem)),
  );
}
