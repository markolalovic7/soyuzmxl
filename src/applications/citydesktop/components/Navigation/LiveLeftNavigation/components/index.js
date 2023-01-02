import { createSelector } from "@reduxjs/toolkit";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import Spinner from "applications/common/components/Spinner";
import { useLiveData } from "applications/common/hooks/useLiveData";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { toggleLiveFavourite } from "redux/slices/liveSlice";

import LeftNavigationMatch from "./LeftNavigationMatch";

const getMatchesByLeague = (matches) => {
  const groups = [];

  let lastEpDesc = null;
  let currentGroup = null;
  matches.forEach((match) => {
    if (lastEpDesc !== match.epDesc) {
      lastEpDesc = match.epDesc;
      currentGroup = { epDesc: match.epDesc, matches: [] };
      groups.push(currentGroup);
    }
    currentGroup.matches.push(match);
  });

  return groups;
};

const europeanDashboardLiveDataSelector = createSelector(
  (state) => state.live.liveData,
  (liveData) => liveData["european-dashboard"],
);

const favouriteSelector = createSelector(
  (state) => state.live.liveFavourites,
  (favourites) => favourites.map((f) => f.eventId),
);

const favouriteLiveSelector = createSelector(
  europeanDashboardLiveDataSelector,
  favouriteSelector,
  (europeanDashboardLiveData, liveFavourites) => {
    const favouriteMatches = [];
    if (europeanDashboardLiveData) {
      Object.values(europeanDashboardLiveData).forEach((sportMatches) => {
        const matches = Object.values(sportMatches);
        favouriteMatches.push(...matches.filter((match) => liveFavourites.includes(match.eventId)));
      });
    }

    return favouriteMatches;
  },
);

const LiveLeftNavigation = () => {
  const { t } = useTranslation();
  const iconRef = useRef([]);
  const hideRefs = useRef([]);
  const showRefs = useRef([]);
  const [rapidMarketsRequired, setRapidMarketsRequired] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);

  // Subscribe to live data...
  const dispatch = useDispatch();
  // const europeanDashboardLiveData = useSelector(state => state.live.liveData['european-dashboard']);

  const europeanDashboardLiveData = useSelector(europeanDashboardLiveDataSelector);

  // const liveFavourites = useSelector(state => state.live.liveFavourites.map(f => f.eventId));
  const liveFavourites = useSelector(favouriteSelector);

  const favouriteLiveMatches = useSelector(favouriteLiveSelector);

  const sports = useSelector((state) => state.sport.sports);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const history = useHistory();
  const navigateToEventDetail = (eventId) => {
    history.push(`/events/live/${eventId}`);
  };

  const location = useLocation();
  const pathname = location.pathname;
  const activeMatchId = pathname.includes("/events/live/")
    ? parseInt(pathname.split("/")[pathname.split("/").length - 1], 10)
    : null;

  const toggleExpandedSection = (section) => {
    if (!expandedSections.includes(section)) {
      setExpandedSections([...expandedSections, section]);
    } else {
      const index = expandedSections.indexOf(section);
      if (index > -1) {
        const updatedSections = [...expandedSections];
        updatedSections.splice(index, 1);
        setExpandedSections(updatedSections);
      }
    }
  };

  return (
    <section className={classes["left-panel"]}>
      <div className={`${classes["left-panel__tabs"]} ${classes["left-panel__tabs_alternative"]}`}>
        <div
          className={`${classes["left-panel__tab"]} ${!rapidMarketsRequired ? classes["left-panel__tab_special"] : ""}`}
          onClick={() => setRapidMarketsRequired(false)}
        >
          {t("city.live_left_navigation.all")}
        </div>
        <div
          className={`${classes["left-panel__tab"]} ${rapidMarketsRequired ? classes["left-panel__tab_special"] : ""}`}
          onClick={() => setRapidMarketsRequired(true)}
        >
          <span className={classes["left-panel__tab-icon"]}>
            <svg fill="none" height="9" viewBox="0 0 9 9" width="9" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.44482 4.84615H4.50177V9L6.55525 4.15385H4.50177V0L2.44482 4.84615Z" fill="white" />
            </svg>
          </span>
        </div>
      </div>

      {favouriteLiveMatches.filter((match) => !rapidMarketsRequired || match.hasRapidMarket).length > 0 ? (
        <div className={classes["left-panel-item"]}>
          <div className={`${classes["left-panel__title"]}`}>
            <span className={classes["left-panel__title-text"]}>
              {`${t("favourites")} (${favouriteLiveMatches.length})`}
            </span>
            <span
              className={`${classes["left-panel__title-icon"]} ${
                expandedSections.includes("FAVOURITES") ? classes["active"] : ""
              }`}
              ref={(el) => {
                iconRef.current[-100] = el;
              }}
              onClick={() => toggleExpandedSection("FAVOURITES")}
            >
              {!expandedSections.includes("FAVOURITES") ? (
                <span
                  className={`${classes["left-panel__hint"]} ${classes["left-panel__hint_show"]}`}
                  ref={(el) => {
                    showRefs.current[-100] = el;
                  }}
                  style={
                    iconRef.current[-100] && {
                      left: iconRef.current[-100]?.getBoundingClientRect().x + 10,
                      top: iconRef.current[-100]?.getBoundingClientRect().y,
                    }
                  }
                >
                  {t("city.live_left_navigation.show_all_odds")}
                </span>
              ) : null}
              {expandedSections.includes("FAVOURITES") ? (
                <span
                  className={`${classes["left-panel__hint"]} ${classes["left-panel__hint_hide"]}`}
                  ref={(el) => {
                    showRefs.current[-100] = el;
                  }}
                  style={
                    iconRef.current[-100] && {
                      left: iconRef.current[-100]?.getBoundingClientRect().x + 10,
                      top: iconRef.current[-100]?.getBoundingClientRect().y,
                    }
                  }
                >
                  {t("city.live_left_navigation.hide_all_odds")}
                </span>
              ) : null}
              <svg
                className={classes["left-panel__title-icon_svg"]}
                fill="none"
                height="12"
                viewBox="0 0 12 12"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.7125 8.5625V12H9.425V8.5625H12L8.575 5.1375L5.1375 8.5625H7.7125ZM6.8625 3.4375H4.2875V0H2.575V3.4375H0L3.425 6.8625L6.8625 3.4375Z" />
              </svg>
            </span>
          </div>

          {getMatchesByLeague(favouriteLiveMatches).map((group, index) => (
            <div className={classes["left-panel__spoiler"]} key={`${group.epDesc}${index}`}>
              <div className={classes["left-panel__spoiler-body"]}>
                <span className={classes["left-panel__spoiler-text"]}>{group.epDesc}</span>
              </div>

              {group.matches.map((match) => (
                <LeftNavigationMatch
                  activeMatchId={activeMatchId}
                  expanded={expandedSections.includes("FAVOURITES")}
                  key={match.eventId}
                  match={match}
                  onClick={() => navigateToEventDetail(match.eventId)}
                  onToggleFavourites={(e) => {
                    e.stopPropagation();
                    dispatch(toggleLiveFavourite({ eventId: match.eventId }));
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {sports && europeanDashboardLiveData ? (
        <div className={classes["left-panel-item"]}>
          {Object.keys(europeanDashboardLiveData).map((sportCode, index) => {
            const sportMatches = europeanDashboardLiveData[sportCode];

            let matches = Object.values(sportMatches);
            if (rapidMarketsRequired) {
              matches = matches.filter((match) => match.hasRapidMarket);
            }
            matches = matches.filter((match) => !liveFavourites.includes(match.eventId));

            if (matches.length === 0) return null;

            return (
              <>
                <div className={classes["left-panel__title"]} key={`${sportCode}${index}`}>
                  <span className={classes["left-panel__title-text"]}>
                    {`${sports[sportCode].description} (${matches.length})`}
                  </span>
                  <span
                    className={`${classes["left-panel__title-icon"]} ${
                      expandedSections.includes(sportCode) ? classes["active"] : ""
                    }`}
                    ref={(el) => {
                      iconRef.current[index] = el;
                    }}
                    onClick={() => toggleExpandedSection(sportCode)}
                  >
                    {!expandedSections.includes(sportCode) ? (
                      <span
                        className={`${classes["left-panel__hint"]} ${classes["left-panel__hint_show"]}`}
                        ref={(el) => {
                          showRefs.current[index] = el;
                        }}
                        style={
                          iconRef.current[index] && {
                            left: iconRef.current[index]?.getBoundingClientRect().x + 10,
                            top: iconRef.current[index]?.getBoundingClientRect().y,
                          }
                        }
                      >
                        {t("city.live_left_navigation.show_all_odds")}
                      </span>
                    ) : null}
                    {expandedSections.includes(sportCode) ? (
                      <span
                        className={`${classes["left-panel__hint"]} ${classes["left-panel__hint_hide"]}`}
                        ref={(el) => {
                          hideRefs.current[index] = el;
                        }}
                        style={
                          iconRef.current[index] && {
                            left: iconRef.current[index].getBoundingClientRect().x + 10,
                            top: iconRef.current[index].getBoundingClientRect().y,
                          }
                        }
                      >
                        {t("city.live_left_navigation.hide_all_odds")}
                      </span>
                    ) : null}
                    <svg
                      className={classes["left-panel__title-icon_svg"]}
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.7125 8.5625V12H9.425V8.5625H12L8.575 5.1375L5.1375 8.5625H7.7125ZM6.8625 3.4375H4.2875V0H2.575V3.4375H0L3.425 6.8625L6.8625 3.4375Z" />
                    </svg>
                  </span>
                </div>

                {getMatchesByLeague(matches).map((group, index) => (
                  <div className={classes["left-panel__spoiler"]} key={`${group.epDesc}${index}`}>
                    <div className={classes["left-panel__spoiler-body"]}>
                      <span className={classes["left-panel__spoiler-text"]}>{group.epDesc}</span>
                    </div>

                    {group.matches.map((match, index) => (
                      <LeftNavigationMatch
                        activeMatchId={activeMatchId}
                        expanded={expandedSections.includes(sportCode)}
                        key={`${match.eventId}${index}`}
                        match={match}
                        onClick={() => navigateToEventDetail(match.eventId)}
                        onToggleFavourites={(e) => {
                          e.stopPropagation();
                          dispatch(toggleLiveFavourite({ eventId: match.eventId }));
                        }}
                      />
                    ))}
                  </div>
                ))}
              </>
            );
          })}
        </div>
      ) : (
        <Spinner className={classes.loader} />
      )}
    </section>
  );
};

const propTypes = {};
const defaultProps = {};

LiveLeftNavigation.propTypes = propTypes;
LiveLeftNavigation.defaultProps = defaultProps;

export default React.memo(LiveLeftNavigation);
