import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLoggedIn } from "../../../../../../redux/reselect/auth-selector";

import LeagueRecommendations from "./LeagueRecommendations";
import MatchRecommendations from "./MatchRecommendations";
import SectionFeaturedLeagues from "./SectionFeaturedLeagues";
import SectionMenu from "./SectionMenu";
import SectionSportsTree from "./SectionSportsTree";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import {
  CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  CMS_LAYOUT_WIDGET_TYPE_LEAGUE_RECOMMENDATION,
  CMS_LAYOUT_WIDGET_TYPE_MATCH_RECOMMENDATION,
  CMS_LAYOUT_WIDGET_TYPE_MENU,
  CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE,
} from "constants/cms-layout-widget-types";
import { getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer } from "redux/reselect/cms-layout-widgets";

const propTypes = {
  onPanelClose: PropTypes.func.isRequired,
  showSportsTree: PropTypes.bool.isRequired,
};

const defaultProps = {};

const PanelSportsTree = forwardRef(({ onPanelClose, showSportsTree }, ref) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const widgetsLeftNavigationDrawer = useSelector((state) =>
    getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer(state, location),
  );

  const renderWidgets = (widgets) =>
    widgets.map((widget) => {
      switch (widget.cmsWidgetType) {
        case CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES: {
          return (
            <SectionFeaturedLeagues
              featuredLeagueItems={widget.data?.featuredLeagues}
              featuredLeagueTitle={widget.data?.description}
              key={widget.ordinal}
              onPanelClose={onPanelClose}
            />
          );
        }
        case CMS_LAYOUT_WIDGET_TYPE_MENU: {
          const { data } = widget || {};

          return (
            <SectionMenu
              key={widget.ordinal}
              menuItems={data.children}
              menuTitle={data.title}
              onPanelClose={onPanelClose}
            />
          );
        }
        case CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE: {
          return <SectionSportsTree key={widget.ordinal} onPanelClose={onPanelClose} {...widget.data} />;
        }

        case CMS_LAYOUT_WIDGET_TYPE_MATCH_RECOMMENDATION: {
          if (!isLoggedIn || widget.data?.mode !== "NATIVE") return null;

          return <MatchRecommendations key={widget.ordinal} onClose={onPanelClose} />;
        }
        case CMS_LAYOUT_WIDGET_TYPE_LEAGUE_RECOMMENDATION: {
          if (!isLoggedIn || widget.data?.mode !== "NATIVE") return null;

          return <LeagueRecommendations key={widget.ordinal} onClose={onPanelClose} />;
        }
        default:
          return null;
      }
    });

  return (
    <aside className={`${classes["burger-menu"]} ${showSportsTree ? classes["active"] : ""}`}>
      <div className={`${classes["overlay-burger"]} ${showSportsTree ? classes["active"] : ""}`} ref={ref}>
        <div className={classes["overlay-burger__label"]}>
          <div className={classes["overlay-burger__hamburger"]} onClick={onPanelClose}>
            <div className={classes["overlay-burger__hamburger-box"]}>
              <div className={classes["overlay-burger__hamburger-inner"]} />
            </div>
          </div>
          <span>{t("navigation")}</span>
        </div>
        {showSportsTree && widgetsLeftNavigationDrawer && <div>{renderWidgets(widgetsLeftNavigationDrawer)}</div>}
      </div>
    </aside>
  );
});

PanelSportsTree.propTypes = propTypes;
PanelSportsTree.defaultProps = defaultProps;

export default PanelSportsTree;
