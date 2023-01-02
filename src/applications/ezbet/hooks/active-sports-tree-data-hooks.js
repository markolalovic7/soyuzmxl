// Choose between the main sports tree data or a filtered version, depending on whether we are on the featured page
import isEmpty from "lodash.isempty";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  getCmsLayoutMobileEZDashboardWidgetFeaturedLeagues,
  getCmsLayoutMobileEZDashboardWidgetSportCarousel,
} from "../../../redux/reselect/cms-layout-widgets";
import { getSortedSportTreesBySportsOrder } from "../../../utils/sort/sport-tree-sort";
import { ALL_KEY, TWO_DAY_SPORTS_KEY } from "../utils/constants";
import { filterSportTreeDataByFeaturedLeagues } from "../utils/sports-tree-utils";

export function useActiveSportsTreeData(sportCode) {
  const sectionSportCarousel = useSelector(getCmsLayoutMobileEZDashboardWidgetSportCarousel);

  const sportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[TWO_DAY_SPORTS_KEY]?.ept ?? [] : [],
  );

  const sportsTreeDataFiltered = useMemo(() => {
    if (!sectionSportCarousel) {
      return sportsTreeData;
    }
    const {
      data: { hiddenSports, sportsOrder },
    } = sectionSportCarousel || { data: { hiddenSports: [], sportsOrder: [] } };
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
      (sportTree) => !hiddenSports?.includes(sportTree.code),
    );
  }, [sectionSportCarousel, sportsTreeData]);

  const {
    data: { featuredLeagues: featuredLeagueItems },
  } = useSelector(getCmsLayoutMobileEZDashboardWidgetFeaturedLeagues) || { data: {} };

  const featuredSportsTreeData = useMemo(() => {
    if (sportCode !== ALL_KEY || isEmpty(featuredLeagueItems) || isEmpty(sportsTreeDataFiltered)) {
      return [];
    }

    return filterSportTreeDataByFeaturedLeagues(featuredLeagueItems, sportsTreeDataFiltered);
  }, [featuredLeagueItems, sportsTreeDataFiltered, sportCode]);

  const activeSportsTreeData = sportCode === ALL_KEY ? featuredSportsTreeData : sportsTreeDataFiltered;

  return { activeSportsTreeData, featuredSportsTreeData, sportsTreeDataFiltered };
}
