import BannersPanel from "applications/vanilladesktop/components/BannersPanel";
import BetslipPanel from "applications/vanilladesktop/components/BetslipPanel";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getCmsLayoutDesktopWidgetsRightColumn } from "redux/reselect/cms-layout-widgets";

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
import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import BannerAds from "../../BannerAds";
import FavouritesMenu from "../../FavouritesMenu";
import FeaturedLeagueMenu from "../../FeaturedLeagueMenu";
import IFrameMenu from "../../IFrameMenu";
import LeagueRecommendationMenu from "../../LeagueRecommendationMenu";
import LiveMatchTracker from "../../LiveMatchTracker";
import MatchRecommendationMenu from "../../MatchRecommendationMenu";
import SideMenu from "../../SideMenu";
import SportsMenu from "../../SportsMenu";

const RightColumn = () => {
  const location = useLocation();
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsRightColumn(state, location));

  return (
    <div className={cx(classes["right-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["right-section__container"]}>
        {widgets?.map((widget, index) => {
          if (isLoggedIn && widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FAVOURITES) {
            return <FavouritesMenu favouriteWidget={widget.data} />;
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES) {
            return <FeaturedLeagueMenu featuredLeagueWidget={widget.data} />;
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS) {
            return (
              <BannerAds
                bannerAdWidget={widget?.data}
                containerClassName="left-section__item"
                titleClassName="left-section__title"
              />
            );
          }
          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BETSLIPS) {
            return <BetslipPanel betslipWidget={widget.data} key={index} />;
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MENU) {
            return <SideMenu menuWidget={widget?.data} />;
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_IFRAME) {
            return (
              <IFrameMenu
                containerClassName="left-section__item"
                iFrameWidget={widget?.data}
                titleClassName="left-section__title"
              />
            );
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MATCH_TRACKER && widget?.data?.mode === "BETRADAR") {
            return <LiveMatchTracker key={index} matchTrackerWidget={widget.data} />;
          }

          if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE) {
            return <SportsMenu sportMenuWidget={widget.data} />;
          }

          if (
            widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MATCH_RECOMMENDATION &&
            widget?.data?.mode === "NATIVE" &&
            isLoggedIn
          ) {
            return <MatchRecommendationMenu matchTrackerWidget={widget?.data} />;
          }

          if (
            widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_LEAGUE_RECOMMENDATION &&
            widget?.data?.mode === "NATIVE" &&
            isLoggedIn
          ) {
            return <LeagueRecommendationMenu matchTrackerWidget={widget?.data} />;
          }

          return null;
        })}

        {/* TODO  For CMS implementation */}
        <BannersPanel />
      </div>
    </div>
  );
};

export default RightColumn;
