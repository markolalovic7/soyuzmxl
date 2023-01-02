import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import {
  CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  CMS_LAYOUT_WIDGET_TYPE_MENU,
  CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE,
} from "constants/cms-layout-widget-types";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getCmsLayoutMobileSlimWidgetsLeftNavigationDrawer } from "redux/reselect/cms-layout-widgets";

import InputSearchWithDebounce from "./InputSearchWithDebounce";
import SectionFeaturedLeagues from "./SectionFeaturedLeagues";
import SectionMenu from "./SectionMenu";
import SportsTree from "./SportsTree";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  onCloseSportsTree: PropTypes.func.isRequired,
  showSportsTree: PropTypes.bool.isRequired,
};

const defaultProps = {};

const SportsTreePanel = ({ backdropClick, onCloseSportsTree, showSportsTree }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");

  const widgetsLeftNavigationDrawer = useSelector((state) =>
    getCmsLayoutMobileSlimWidgetsLeftNavigationDrawer(state, location),
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
              onCloseSportsTree={onCloseSportsTree}
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
              onCloseSportsTree={onCloseSportsTree}
            />
          );
        }
        case CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE: {
          return (
            <SportsTree
              key={widget.ordinal}
              searchKeyword={searchKeyword}
              onCloseSportsTree={onCloseSportsTree}
              {...widget.data}
            />
          );
        }
        default:
          return null;
      }
    });

  return (
    <div className={`${classes["header__menu"]} ${showSportsTree ? classes.active : ""}`} onClick={backdropClick}>
      <div className={`${classes["overlay-burger"]} ${showSportsTree ? classes.active : ""}`}>
        <InputSearchWithDebounce
          placeholder={t("search")}
          value={searchKeyword}
          onChange={(value) => setSearchKeyword(value)}
        />
        {showSportsTree && widgetsLeftNavigationDrawer && renderWidgets(widgetsLeftNavigationDrawer)}
      </div>
    </div>
  );
};

SportsTreePanel.propTypes = propTypes;
SportsTreePanel.defaultProps = defaultProps;

export default SportsTreePanel;
