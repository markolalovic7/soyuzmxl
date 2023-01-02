import FavouritesMenu from "applications/vanilladesktop/components/FavouritesMenu";
import SportsMenu from "applications/vanilladesktop/components/SportsMenu";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS,
  CMS_LAYOUT_WIDGET_TYPE_BETSLIPS,
  CMS_LAYOUT_WIDGET_TYPE_FAVOURITES,
  CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  CMS_LAYOUT_WIDGET_TYPE_IFRAME,
  CMS_LAYOUT_WIDGET_TYPE_LEAGUE_RECOMMENDATION,
  CMS_LAYOUT_WIDGET_TYPE_MATCH_RECOMMENDATION,
  CMS_LAYOUT_WIDGET_TYPE_MATCH_TRACKER,
  CMS_LAYOUT_WIDGET_TYPE_MENU,
  CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE,
} from "../../../../../constants/cms-layout-widget-types";
import { getAuthLoggedIn } from "../../../../../redux/reselect/auth-selector";
import { getCmsLayoutDesktopWidgetsLeftColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import BannerAds from "../../BannerAds";
import BetslipPanel from "../../BetslipPanel/components";
import FeaturedLeagueMenu from "../../FeaturedLeagueMenu";
import IFrameMenu from "../../IFrameMenu";
import LeagueRecommendationMenu from "../../LeagueRecommendationMenu";
import LiveMatchTracker from "../../LiveMatchTracker";
import MatchRecommendationMenu from "../../MatchRecommendationMenu";
import SideMenu from "../../SideMenu";

const LeftColumnMenus = () => {
  const location = useLocation();
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsLeftColumn(state, location));

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["left-section__content"]}>
        {widgets?.map((widget, index) => {
          if (isLoggedIn && widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FAVOURITES) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <FavouritesMenu favouriteWidget={widget?.data} />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <FeaturedLeagueMenu featuredLeagueWidget={widget.data} />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <SportsMenu sportMenuWidget={widget?.data} />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <BannerAds
                  bannerAdWidget={widget?.data}
                  containerClassName="left-section__item"
                  titleClassName="left-section__title"
                />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BETSLIPS) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <BetslipPanel betslipWidget={widget?.data} />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MENU) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <SideMenu menuWidget={widget?.data} />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_IFRAME) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <IFrameMenu
                  containerClassName="left-section__item"
                  iFrameWidget={widget?.data}
                  titleClassName="left-section__title"
                />
              </div>
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MATCH_TRACKER && widget?.data?.mode === "BETRADAR") {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <LiveMatchTracker matchTrackerWidget={widget?.data} />
              </div>
            );
          }

          if (
            widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MATCH_RECOMMENDATION &&
            widget?.data?.mode === "NATIVE" &&
            isLoggedIn
          ) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <MatchRecommendationMenu matchTrackerWidget={widget?.data} />
              </div>
            );
          }

          if (
            widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_LEAGUE_RECOMMENDATION &&
            widget?.data?.mode === "NATIVE" &&
            isLoggedIn
          ) {
            return (
              <div className={classes["left-section__item"]} key={index}>
                <LeagueRecommendationMenu matchTrackerWidget={widget?.data} />
              </div>
            );
          }

          return undefined;
        })}
      </div>
    </div>
  );
};

export default React.memo(LeftColumnMenus);
