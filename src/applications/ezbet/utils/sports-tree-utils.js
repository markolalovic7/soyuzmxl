import dayjs from "dayjs";
import isEmpty from "lodash.isempty";

import { isNotEmpty } from "../../../utils/lodash";

export const filterSportTreeDataByFeaturedLeagues = (featuredLeagueItems, sportTreeData) => {
  const filteredSportTreeData = [];

  if (isEmpty(featuredLeagueItems)) return [];

  const leagueIds = featuredLeagueItems.map((x) => x.eventPathId);
  const sportCodes = featuredLeagueItems.map((x) => x.sportCode);

  sportTreeData
    .filter(
      (x) =>
        sportCodes.includes(x.code) && isNotEmpty(Object.keys(x.criterias).filter((c) => c !== "live" && c !== "oc")),
    )
    .forEach((sport) => {
      // does it exist in the sportsTreeData anywhere?

      // TODO this could be done recursively

      let sportCount = 0;
      let sportEventCount = 0;
      let sportEventCount2 = 0;
      const sportCriterias = {};

      const code = sport.code;

      // category
      sport?.path
        ?.filter((x) => isNotEmpty(Object.keys(x.criterias).filter((c) => c !== "live" && c !== "oc")))
        ?.forEach((category) => {
          let categoryCount = 0;
          let categoryEventCount = 0;
          let categoryEventCount2 = 0;
          const categoryCriterias = {};

          // tournament
          category?.path
            ?.filter((x) => isNotEmpty(Object.keys(x.criterias).filter((c) => c !== "live" && c !== "oc")))
            ?.forEach((tournament) => {
              if (leagueIds.includes(tournament.id)) {
                // track the counters
                categoryCount += tournament.count;
                categoryEventCount += tournament.eventCount;
                categoryEventCount2 += tournament.eventCount2;
                sportCount += tournament.count;
                sportEventCount += tournament.eventCount;
                sportEventCount2 += tournament.eventCount2;

                for (const [key, value] of Object.entries(tournament.criterias)) {
                  categoryCriterias[key] = (categoryCriterias[key] || 0) + value;
                  sportCriterias[key] = (sportCriterias[key] || 0) + value;
                }

                // if the sport was not added, add it now. Else update it
                let currentSport = filteredSportTreeData.find((x) => x.code === code);
                if (currentSport) {
                  currentSport.count = sportCount;
                  currentSport.eventCount = sportEventCount;
                  currentSport.eventCount2 = sportEventCount2;
                  currentSport.criterias = sportCriterias;
                } else {
                  currentSport = {
                    code,
                    count: sportCount,
                    criterias: sportCriterias,
                    desc: sport.desc,
                    eventCount: sportEventCount,
                    eventCount2: sportEventCount2,
                    id: sport.id,
                    path: [],
                  };
                  filteredSportTreeData.push(currentSport);
                }

                // if the category was not added, time to do it. Else just update the counters
                let currentCategory = currentSport?.path?.find((x) => x.id === category.id);
                if (currentCategory) {
                  currentCategory.count = categoryCount;
                  currentCategory.eventCount = categoryEventCount;
                  currentCategory.eventCount2 = categoryEventCount2;
                  currentCategory.criterias = categoryCriterias;
                } else {
                  currentCategory = {
                    count: categoryCount,
                    countryCode: category.countryCode,
                    criterias: categoryCriterias,
                    desc: category.desc,
                    eventCount: categoryEventCount,
                    eventCount2: categoryEventCount2,
                    id: category.id,
                    path: [],
                  };

                  currentSport.path.push(currentCategory);
                }

                // add the tournament
                currentCategory.path.push({ ...tournament });
              }
            });
        });
    });

  return filteredSportTreeData;
};

export const getSportEndDate = () =>
  `${dayjs()
    .add(2, "day")
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .set("millisecond", 999)
    .toDate()
    .toISOString()
    .slice(0, -1)}+00:00`;
