import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { matchPath, useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";

import {
  getCmsLayoutMobileEZDashboardWidgetFeaturedLeagues,
  getCmsLayoutMobileEZDashboardWidgetSportCarousel,
} from "../../../../../../redux/reselect/cms-layout-widgets";
import { isNotEmpty } from "../../../../../../utils/lodash";
import { getSortedSportTreesBySportsOrder } from "../../../../../../utils/sort/sport-tree-sort";
import "../../../../scss/simplebar.min.css";
import classes from "../../../../scss/ezbet.module.scss";
import { ALL_KEY, TWO_DAY_SPORTS_KEY } from "../../../../utils/constants";
import { filterSportTreeDataByFeaturedLeagues } from "../../../../utils/sports-tree-utils";
import CarouselSportCard from "../../CarouselSportCard";

import SearchBar from "./SearchBar";

import { getPatternSearch, getPatternSearchResults } from "../../../../../../utils/route-patterns";

import SearchCard from "./SearchCard";

const propTypes = {};

const defaultProps = {};

// const createScrollStopListener = (element, callback, timeout) => {
//   let removed = false;
//   let handle = null;
//   const onScroll = () => {
//     if (handle) {
//       clearTimeout(handle);
//     }
//     handle = setTimeout(callback, timeout || 200); // default 200 ms
//   };
//   if (element) {
//     element.addEventListener('scroll', onScroll);
//   }

//   return () => {
//     if (removed) {
//       return;
//     }
//     removed = true;
//     if (handle) {
//       clearTimeout(handle);
//     }
//     element?.removeEventListener('scroll', onScroll);
//   };
// };

// const useScrollStopListener = (callback, timeout) => {
//   const containerRef = useRef();
//   const callbackRef = useRef();
//   callbackRef.current = callback;
//   useEffect(() => {
//     const destroyListener = createScrollStopListener(containerRef.current, () => {
//       if (callbackRef.current) {
//         callbackRef.current();
//       }
//     });

//     return () => destroyListener();
//   }, [containerRef.current]);

//   return containerRef;
// };

const PrematchSportCarousel = () => {
  const { sportCode } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const sectionSportCarousel = useSelector(getCmsLayoutMobileEZDashboardWidgetSportCarousel);

  const sportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[TWO_DAY_SPORTS_KEY]?.ept ?? [] : [],
  );

  // const [scrollIsActive, setScrollIsActive] = useState(false)

  // const containerRef = useScrollStopListener(() => {
  //   console.log('onscrollstop');
  //   setTimeout(() => {
  //     setScrollIsActive(false)
  //   }, 1000);
  // });

  const sportsTreeDataFiltered = useMemo(() => {
    if (!sectionSportCarousel) {
      return sportsTreeData?.filter((s) => {
        if (s.eventCount2 === 0) return false;

        const criterias = Object.entries(s.criterias);

        if (isEmpty(criterias)) return false;

        return criterias[0] !== "oc" && criterias[0] !== "live";
      });
    }
    const {
      data: { hiddenSports, sportsOrder },
    } = sectionSportCarousel || { data: { hiddenSports: [], sportsOrder: [] } };
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder)
      .filter((sportTree) => !hiddenSports?.includes(sportTree.code))
      .filter((s) => {
        if (s.eventCount2 === 0) return false;

        const criterias = Object.entries(s.criterias);

        if (isEmpty(criterias)) return false;

        const sportCount = Object.values(criterias)
          .filter((c) => c[0] !== "oc" && c[0] !== "live")
          .map((x) => x[1])
          .reduce((a, b) => a + b, 0);

        return sportCount > 0;
      });
  }, [sectionSportCarousel, sportsTreeData]);

  const {
    data: { featuredLeagues: featuredLeagueItems },
  } = useSelector(getCmsLayoutMobileEZDashboardWidgetFeaturedLeagues) || { data: {} };

  const featuredSportsTreeData = useMemo(() => {
    if (isEmpty(featuredLeagueItems) || isEmpty(sportsTreeDataFiltered)) {
      return [];
    }

    return filterSportTreeDataByFeaturedLeagues(featuredLeagueItems, sportsTreeDataFiltered);
  }, [featuredLeagueItems, sportsTreeDataFiltered]);

  const isSearchPage = useMemo(() => {
    const isSearchInputPage = matchPath(location.pathname, { exact: true, path: getPatternSearch() });
    const isSearchResultsPage = matchPath(location.pathname, { exact: true, path: getPatternSearchResults() });

    return isSearchInputPage || isSearchResultsPage;
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchPage) return;

    if (
      (!sportCode || (sportCode === ALL_KEY && isEmpty(featuredSportsTreeData))) &&
      !isEmpty(sportsTreeDataFiltered) &&
      !isEmpty(sportsTreeDataFiltered[0])
    ) {
      history.push(`/prematch/sport/${sportsTreeDataFiltered[0].code}`);
    }
  }, [isSearchPage, sportCode, sportsTreeDataFiltered, featuredSportsTreeData, history]);

  const onChangeSportHandler = (sportCode) => {
    history.push(`/prematch/sport/${sportCode}`);
  };

  if (!isSearchPage && isEmpty(sportsTreeDataFiltered)) {
    return (
      <section className={classes["top-level"]}>
        <div className={classes["top-level-sports"]} style={{ display: "flex", justifyContent: "center" }}>
          <FontAwesomeIcon
            className="fa-spin"
            icon={faSpinner}
            size="3x"
            style={{
              "--fa-primary-color": "#00ACEE",
              "--fa-secondary-color": "#E6E6E6",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={classes["top-level"]}>
      <SimpleBar autoHide>
        <div className={classes["top-level-sports"]} style={{ overflow: `${isSearchPage ? "hidden" : "unset"}` }}>
          {isSearchPage ? <SearchBar /> : <SearchCard />}

          {!isSearchPage && isNotEmpty(featuredSportsTreeData) && (
            <div
              className={cx(classes["relative"], classes["sport-card"], {
                [classes["sport-card-active"]]: sportCode === ALL_KEY,
              })}
              key={ALL_KEY}
              onClick={() => history.push(`/prematch/sport/${ALL_KEY}`)}
            >
              <small className={classes["absolute"]}>
                {featuredSportsTreeData?.reduce((prev, next) => prev + next.eventCount2, 0)}
              </small>
              <div className={classes["sport"]}>
                <i aria-hidden="true" className={cx(classes["icon"], classes["icon-big-leagues"])} />
                <small>{t("ez.featured_leagues")}</small>
              </div>
            </div>
          )}
          {!isSearchPage &&
            sportsTreeDataFiltered
              ?.filter((x) => x.eventCount2 > 0)
              ?.map((sport, index) => {
                // Recompute cleanly to avoid going ahead with live events only
                const sportCount = Object.entries(sport.criterias)
                  .filter((c) => c[0] !== "oc" && c[0] !== "live")
                  .map((x) => x[1])
                  .reduce((a, b) => a + b, 0);

                if (sportCount === 0) return null;

                return (
                  <CarouselSportCard
                    key={sport.code}
                    sport={sport}
                    sportCode={sportCode}
                    sportCount={sportCount}
                    onClick={() => onChangeSportHandler(sport.code)}
                  />
                );
              })}
        </div>
      </SimpleBar>
    </section>
  );
};

PrematchSportCarousel.propTypes = propTypes;
PrematchSportCarousel.defaultProps = defaultProps;

export default React.memo(PrematchSportCarousel);
