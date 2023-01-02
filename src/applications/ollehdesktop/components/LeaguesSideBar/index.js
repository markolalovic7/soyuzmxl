import ArrowRightIcon from "applications/ollehdesktop/img/icons/arrow-right.svg";
import CalendarIcon from "applications/ollehdesktop/img/icons/calendar.svg";
import CupIcon from "applications/ollehdesktop/img/icons/cup.svg";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import {
  CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE,
} from "../../../../constants/cms-layout-widget-types";
import { getCmsLayoutDesktopWidgetsLeftColumn } from "../../../../redux/reselect/cms-layout-widgets";
import { getSportsTreeSelector } from "../../../../redux/reselect/sport-tree-selector";
import { getFeaturedLeagueItems } from "../../../../utils/navigation-drawer/featured-league";
import { getSortedSportTreesBySportsOrder } from "../../../../utils/sort/sport-tree-sort";

const LeaguesSideBar = () => {
  const history = useHistory();
  const { t } = useTranslation();

  // Extract widgets left bar from CMS selectors
  const location = useLocation();
  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsLeftColumn(state, location));

  const featuredLeagueWidget = widgets?.find(
    (widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  );

  const sportsTreeWidget = widgets?.find((widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE);

  const sportTreeData = useSelector(getSportsTreeSelector);

  const featuredLeagues = useMemo(() => {
    const leagues = featuredLeagueWidget?.data?.featuredLeagues || [];

    if (isEmpty(leagues) || isEmpty(sportTreeData)) {
      return [];
    }

    return getFeaturedLeagueItems(leagues, sportTreeData);
  }, [featuredLeagueWidget, sportTreeData]);

  const sportTreeItems = useMemo(() => {
    const sportTreeItems = [];
    if (sportsTreeWidget?.data && !isEmpty(sportTreeData)) {
      const { countType, hiddenSports, showCount, sportsOrder } = sportsTreeWidget?.data;

      return getSortedSportTreesBySportsOrder(sportTreeData, sportsOrder)
        .filter((sportTree) => !hiddenSports?.includes(sportTree.code))
        .filter((sport) => Object.keys(sport.criterias).find((x) => x.startsWith("d")))
        .map((sport) => {
          const firstCountry = sport.path.filter((x) => Object.keys(x.criterias).find((x) => x.startsWith("d")))[0];
          const firstLeague = firstCountry.path.filter((x) =>
            Object.keys(x.criterias).find((x) => x.startsWith("d")),
          )[0];

          return { count: sport.eventCount, desc: sport.desc, eventPathId: firstLeague.id, sportCode: sport.code };
        });
    }

    return sportTreeItems;
  }, [sportsTreeWidget, sportTreeData]);

  return (
    <div className={classes["leagues__sidebar"]}>
      <div className={classes["leagues__sidebar-header"]}>
        <img alt="" src={CupIcon} />
        <h3>{t("top_leagues_page").toUpperCase()}</h3>
      </div>
      {featuredLeagueWidget && (
        <div className={classes["leagues__sidebar-list"]}>
          {featuredLeagues.map((league) => (
            <div
              className={classes["leagues__sidebar-item"]}
              key={league.eventPathDescription}
              onClick={() => history.push(`/prematch/eventpath/${league.eventPathId}`)}
            >
              <span
                className={cx(
                  classes["qicon-default"],
                  classes[`qicon-${league.sportCode.toLowerCase()}`],
                  classes["icon"],
                )}
              />
              <span className={classes["leagues__sidebar-item-title"]}>{league.eventPathDescription}</span>
            </div>
          ))}
        </div>
      )}
      <div className={`${classes["leagues__sidebar-header"]} ${classes["bets"]}`}>
        <img alt="" src={CalendarIcon} />
        <h3>{t("todays_events").toUpperCase()}</h3>
        <img alt="" src={ArrowRightIcon} />
      </div>
      {sportsTreeWidget && (
        <>
          <div className={classes["leagues__sidebar-sports"]}>
            <h3>{t("sports")}</h3>
          </div>
          <div className={classes["leagues__sidebar-events"]}>
            <h3>{`${t("matches")} - ${sportTreeItems.reduce((n, { count }) => count + n, 0)}`}</h3>
          </div>
          <div className={classes["leagues__sidebar-events-list"]}>
            {sportTreeItems.map((sport) => (
              <div
                className={classes["leagues__sidebar-event"]}
                key={sport.desc}
                onClick={() => history.push(`/prematch/eventpath/${sport.eventPathId}`)}
              >
                <span
                  className={cx(
                    classes["qicon-default"],
                    classes[`qicon-${sport.sportCode.toLowerCase()}`],
                    classes["icon"],
                  )}
                />
                <span className={classes["leagues__sidebar-item-title"]}>{sport.desc}</span>
                <span className={classes["count"]}>{sport.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(LeaguesSideBar);
