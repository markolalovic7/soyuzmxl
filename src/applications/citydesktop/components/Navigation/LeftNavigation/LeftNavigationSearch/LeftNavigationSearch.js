import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import trim from "lodash.trim";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getLocaleDateDayNumberMonthTimeFormatKOSpecific } from "utils/date-format";

import { loadCouponData, searchForCouponData } from "../../../../../../redux/slices/couponSlice";
import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { recursiveItemSearch } from "../../../../../vanilladesktop/utils/pathUtils";
import { ReactComponent as SearchIcon } from "../../../../img/icons/search.svg";
import classes from "../../../../scss/citywebstyle.module.scss";
import { getFeaturedLeagues } from "../utils/NavigationUtils";

const getRecentClicks = () => {
  const recentClicks = localStorage.getItem("recentClicks");

  if (recentClicks) {
    try {
      const recentClickSet = JSON.parse(recentClicks);

      // filter is there to handle previous formats - exclude unsupported
      return recentClickSet.filter((m) => m.type);
    } catch (e) {
      localStorage.removeItem("recentClicks"); // handle legacy formats by clearing out

      return [];
    }
  }

  return [];
};

// Filter events - include those events that have a match on name (i.e. not on league name)
// OR include them when there is a match by league (only one match per league, to avoid duplication).
const filterEvents = (searchEvents, searchString) =>
  searchEvents.filter(
    (value, index, self) =>
      !value.path["League"].toUpperCase().includes(searchString.toUpperCase()) || // string match not on league
      index ===
        self.findIndex(
          (t) => t.path["Country/Region"] === value.path["Country/Region"] && t.path["League"] === value.path["League"],
        ), // string match on league - but avoid duplicates by country and league
  );

const LeftNavigationSearch = () => {
  const { t } = useTranslation();

  const locale = useSelector(getAuthLanguage);
  const dateFormat = getLocaleDateDayNumberMonthTimeFormatKOSpecific(locale);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const [searchString, setSearchString] = useState("");

  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  // Track "click outside component"
  const refSearchPanel = useRef();

  const closePanel = (e) => {
    if (refSearchPanel.current.contains(e.target)) {
      // inside click
      return;
    }
    setSearchPanelOpen(false);
    setSearchString("");
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", closePanel);

    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", closePanel);
    };
  }, []);
  // End "Track..."

  const onCloseSearchHandler = () => {
    setSearchPanelOpen(false);
    setSearchString("");
  };

  const onChangeSearchInputHandler = (e) => {
    setSearchString(e.target.value);
  };

  const [recentClickSet, setRecentClickSet] = useState(getRecentClicks());

  const history = useHistory();
  const onSelectEventHandler = (live, matchId) => {
    // ...Check if this event already existed, and remove it...
    let updatedRecentClicks = recentClickSet.filter((x) => x.type === "PATH" || x.matchId !== matchId);

    // ... Add the new one to the top of the stack
    updatedRecentClicks = [{ live, matchId, type: "MATCH" }, ...updatedRecentClicks];

    // ...and limit to max 5...
    updatedRecentClicks = updatedRecentClicks.slice(0, 5);

    setRecentClickSet(updatedRecentClicks);

    // Dump to local storage...
    localStorage.setItem("recentClicks", JSON.stringify(updatedRecentClicks));

    if (live) {
      history.push(`/events/live/${matchId}`); // navigate to the new route...
    } else {
      history.push(`/events/prematch/${matchId}`); // navigate to the new route...
    }
    onCloseSearchHandler();
  };

  const onSelectEventPathHandler = (sportCode, eventPathIdStr) => {
    const eventPathId = Number(eventPathIdStr);

    // ...Check if this event already existed, and remove it...
    let updatedRecentClicks = recentClickSet.filter((x) => x.type === "MATCH" || x.id !== eventPathId);

    // ... Add the new one to the top of the stack
    updatedRecentClicks = [{ code: sportCode, id: eventPathId, type: "PATH" }, ...updatedRecentClicks];

    // ...and limit to max 5...
    updatedRecentClicks = updatedRecentClicks.slice(0, 5);

    setRecentClickSet(updatedRecentClicks);

    // Dump to local storage...
    localStorage.setItem("recentClicks", JSON.stringify(updatedRecentClicks));

    history.push(`/leagues/${sportCode}/${eventPathId}`); // navigate to the new route...

    setSearchString("");

    onCloseSearchHandler();
  };

  const clearAllRecent = () => {
    localStorage.removeItem("recentEvents"); // legacy - remove at any point after Sep 2022
    localStorage.removeItem("recentClicks");
    setRecentClickSet([]);
  };

  const dispatch = useDispatch();
  const searchCouponData = useSelector((state) => state.coupon.searchCouponData);
  const searchLoading = useSelector((state) => state.coupon.searchLoading);
  const authLanguage = useSelector(getAuthLanguage);

  const enoughCharsForSearch =
    (authLanguage === "en" && trim(searchString).length > 2) ||
    (authLanguage !== "en" && trim(searchString).length > 0);

  useEffect(() => {
    if (enoughCharsForSearch) {
      const eventPathSubscriptionData = {
        allMarkets: false,
        keyword: searchString,
        live: false,
        virtual: false,
        // african: false,
        // asianCriteria: null,
        // marketTypeGroups: null,
        // count: null,
        // from: null,
      };

      dispatch(searchForCouponData({ ...eventPathSubscriptionData }));
    }

    return () => {
      // unsubscribe
    };
  }, [dispatch, searchString, enoughCharsForSearch]);

  // We load "Recommended" content out of CMS and show it when the panel is open but the user has not searched anything yet
  const cmsConfig = useSelector((state) => state.cms.config);
  const featuredLeagues = getFeaturedLeagues(cmsConfig);
  const recommendedCodes = featuredLeagues.map((league) => `p${league.eventPathId}`).join(",");
  const recommendedCouponData = useSelector((state) => state.coupon.couponData[recommendedCodes]);
  const recentPrematchCodes = recentClickSet
    .filter((match) => match.type === "MATCH" && !match.live)
    .map((match) => `${match.live ? "l" : "e"}${match.matchId}`)
    .join(",");
  const recentLiveCodes = recentClickSet
    .filter((match) => match.type === "MATCH" && match.live)
    .map((match) => `${match.live ? "l" : "e"}${match.matchId}`)
    .join(",");
  const recentPrematchCouponData = useSelector((state) => state.coupon.couponData[recentPrematchCodes]);
  const recentLiveCouponData = useSelector((state) => state.coupon.couponData[recentLiveCodes]);

  useEffect(() => {
    if (!recommendedCouponData && recommendedCodes.length > 0) {
      const subscriptionData = {
        allMarkets: false,
        codes: recommendedCodes,
        eventType: "GAME",
        live: false,
        shortNames: false,
        virtual: false,
      };

      dispatch(loadCouponData({ ...subscriptionData }));

      // NOTE - We do not clear the search - it's not something that will change as you navigate...
    }
  }, [dispatch, recommendedCodes, recommendedCouponData]);

  useEffect(() => {
    if (recentPrematchCodes.length > 0) {
      const subscriptionData = {
        allMarkets: false,
        codes: recentPrematchCodes,
        eventType: "GAME",
        live: false,
        shortNames: false,
        virtual: false,
      };

      dispatch(loadCouponData({ ...subscriptionData }));

      // NOTE - We do not clear the search - it's not something that will change as you navigate...
    }
  }, [dispatch, recentPrematchCodes]);

  useEffect(() => {
    if (recentLiveCodes.length > 0) {
      const subscriptionData = {
        allMarkets: false,
        codes: recentLiveCodes,
        eventType: "GAME",
        live: true,
        shortNames: false,
        virtual: false,
      };

      dispatch(loadCouponData({ ...subscriptionData }));

      // NOTE - We do not clear the search - it's not something that will change as you navigate...
    }
  }, [dispatch, recentLiveCodes]);

  const searchEvents = searchCouponData ? filterEvents(getEvents(Object.values(searchCouponData)), searchString) : [];
  const recommendedEvents = recommendedCouponData
    ? getEvents(Object.values(recommendedCouponData))
        .sort((a, b) => a.epoch - b.epoch)
        .slice(0, 5)
    : [];

  const recentLiveEvents = recentLiveCouponData ? getEvents(Object.values(recentLiveCouponData)) : [];
  const recentPrematchEvents = recentPrematchCouponData ? getEvents(Object.values(recentPrematchCouponData)) : [];
  const recentEvents = recentLiveEvents.concat(recentPrematchEvents).slice(0, 5);

  const recentEventPaths = useMemo(() => {
    if (isEmpty(recentClickSet) || isEmpty(sportsTreeData)) return [];

    const recentEventPaths = recentClickSet?.filter((match) => match.type === "PATH");

    if (isEmpty(recentEventPaths)) {
      return [];
    }

    return recentEventPaths
      .map((eventPath) => recursiveItemSearch(sportsTreeData.ept, Number(eventPath.id)))
      .filter((x) => !!x);
  }, [recentClickSet, sportsTreeData]);

  const [dirtySearch, setDirtySearch] = useState(false);
  useEffect(() => {
    setDirtySearch(true);
  }, [searchString]);

  useEffect(() => {
    if (!searchLoading && searchCouponData) {
      setDirtySearch(false);
    }
  }, [searchCouponData, searchLoading]);

  const showSearchResults = enoughCharsForSearch && (dirtySearch || searchLoading || searchEvents.length > 0);

  return (
    <div className={classes["search"]}>
      <div className={classes["search__search"]}>
        <div className={classes["search__input"]}>
          <span className={classes["search__icon"]}>
            <SearchIcon />
          </span>
          <input
            className={classes["search-input"]}
            placeholder={t("search")}
            type="text"
            value={searchString}
            onChange={onChangeSearchInputHandler}
            onClick={() => setSearchPanelOpen(true)}
          />
          <span
            className={`${classes["search__close"]} ${searchPanelOpen ? classes["active"] : ""}`}
            onClick={onCloseSearchHandler}
          />

          <div ref={refSearchPanel}>
            {searchPanelOpen ? (
              <>
                <div className={`${classes["search-result"]} ${showSearchResults ? classes["active"] : ""}`}>
                  <h2 className={classes["search-result__title"]}>
                    {!searchLoading && searchCouponData
                      ? `${t("city.navigation_search.search_results")} (${searchEvents.length})`
                      : t("city.navigation_search.search_results")}
                  </h2>
                  {searchLoading || !searchCouponData ? (
                    <Spinner className={classes.loader} />
                  ) : (
                    searchEvents.map((match) => {
                      if (match.path["League"].toUpperCase().includes(searchString.toUpperCase())) {
                        return (
                          <div
                            className={classes["search-result__item"]}
                            key={match.id}
                            onClick={() =>
                              onSelectEventPathHandler(match.code, match.parent.substr(1, match.parent.length))
                            }
                          >
                            <div className={classes["search-recommended__teams"]}>
                              <div className={classes["search-recommended__team"]}>{match.path["League"]}</div>
                            </div>
                            <div className={classes["search-result__match"]}>
                              <span className={classes["search-result__league"]}>{match.path["Country/Region"]}</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          className={classes["search-result__item"]}
                          key={match.id}
                          onClick={() => onSelectEventHandler(match.type === "l", match.id)}
                        >
                          <div className={classes["search-recommended__teams"]}>
                            <div className={classes["search-recommended__team"]}>{match.a}</div>
                            <div className={classes["search-recommended__team"]}>{match.b}</div>
                          </div>
                          <div className={classes["search-result__match"]}>
                            <span className={classes["search-result__league"]}>{match.path["League"]}</span>
                            <span className={classes["search-result__date"]}>
                              {dayjs.unix(match.epoch / 1000).format(dateFormat)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`${classes["search-recommended"]} ${!showSearchResults ? classes["active"] : ""}`}>
                  {searchString.length > 2 ? (
                    <div className={classes["search__no-results"]}>{t("city.navigation_search.no_search_results")}</div>
                  ) : null}

                  {recentEvents?.length > 0 || recentEventPaths?.length > 0 ? (
                    <div className={classes["search-recent"]}>
                      <h2 className={classes["search-recent__title"]}>
                        <span>{t("city.navigation_search.recent_search_results")}</span>
                        <span className={classes["search-recent__clear"]} onClick={clearAllRecent}>
                          {t("city.navigation_search.clear_all")}
                        </span>
                      </h2>

                      {recentEventPaths.map((result) => (
                        <div
                          className={classes["search-result__item"]}
                          key={result.id}
                          onClick={() => onSelectEventPathHandler(result.code, result.id)}
                        >
                          <div className={classes["search-recommended__teams"]}>
                            <div className={classes["search-recommended__team"]}>{result.desc}</div>
                          </div>
                          <div className={classes["search-result__match"]}>
                            <span className={classes["search-result__league"]}>{result.parentDesc}</span>
                          </div>
                        </div>
                      ))}

                      {recentEvents.map((match) => (
                        <div
                          className={classes["search-recent__item"]}
                          key={match.id}
                          onClick={() => onSelectEventHandler(match.type === "l", match.id)}
                        >
                          <div className={classes["search-recent__teams"]}>
                            <div className={classes["search-recent__team"]}>{match.a}</div>
                            <div className={classes["search-recent__team"]}>{match.b}</div>
                          </div>
                          <div className={classes["search-recent__match"]}>
                            <span className={classes["search-recent__league"]}>{match.path["League"]}</span>
                            <span className={classes["search-recent__date"]}>
                              {dayjs.unix(match.epoch / 1000).format(dateFormat)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <h2 className={classes["search-recommended__title"]}>
                    {recommendedEvents.length > 0
                      ? `${t("city.navigation_search.search_recommended")} (${recommendedEvents.length})`
                      : t("city.navigation_search.search_recommended")}
                  </h2>
                  {!recommendedCouponData ? (
                    <Spinner className={classes.loader} />
                  ) : (
                    recommendedEvents.map((match) => (
                      <div
                        className={classes["search-recommended__item"]}
                        key={match.id}
                        onClick={() => onSelectEventHandler(match.type === "l", match.id)}
                      >
                        <div className={classes["search-recommended__team"]}>{match.a}</div>
                        <div className={classes["search-recommended__team"]}>{match.b}</div>
                        <div className={classes["search-recommended__match"]}>
                          <span className={classes["search-recommended__league"]}>{match.path["League"]}</span>
                          <span className={classes["search-recommended__date"]}>
                            {dayjs.unix(match.epoch / 1000).format(dateFormat)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeftNavigationSearch);
