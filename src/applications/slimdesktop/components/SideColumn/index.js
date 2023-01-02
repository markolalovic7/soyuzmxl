import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS,
  CMS_LAYOUT_WIDGET_TYPE_BETSLIPS,
  CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES,
  CMS_LAYOUT_WIDGET_TYPE_IFRAME,
  CMS_LAYOUT_WIDGET_TYPE_MENU,
  CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE,
} from "../../../../constants/cms-layout-widget-types";
import {
  getCmsLayoutDesktopWidgetsLeftColumn,
  getCmsLayoutDesktopWidgetsRightColumn,
} from "../../../../redux/reselect/cms-layout-widgets";

import BannerAdsSideWidget from "./components/BannerAdsSideWidget";
import BetslipSideWidget from "./components/BetslipSideWidget";
import FeaturedLeagueSideWidget from "./components/FeaturedLeagueMenu";
import IFrameSideWidget from "./components/IFrameSideWidget";
import MenuSideWidget from "./components/MenuSideWidget";
import SportsTreeSideWidget from "./components/SportsTreeSideWidget";

const propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
};
const defaultProps = { left: false, right: false };

const SideColumn = ({ left, right }) => {
  const { t } = useTranslation();

  const location = useLocation();
  const leftWidgets = useSelector((state) => getCmsLayoutDesktopWidgetsLeftColumn(state, location));
  const rightWidgets = useSelector((state) => getCmsLayoutDesktopWidgetsRightColumn(state, location));

  const widgets = left ? leftWidgets : rightWidgets;

  return (
    <aside className={classes["sidebar"]}>
      {/* {left && ( */}
      {/*  <div className={classes["sidebar__box"]}> */}
      {/*    <form className={classes["sidebar__search"]}> */}
      {/*      <input */}
      {/*        className={classes["sidebar__search-inp"]} */}
      {/*        id="sbSearch" */}
      {/*        name="sbSearch" */}
      {/*        placeholder={t("search")} */}
      {/*        type="text" */}
      {/*      /> */}
      {/*      <button className={classes["sidebar__search-btn"]} type="submit"> */}
      {/*        <span className={classes["qicon-search"]} /> */}
      {/*      </button> */}
      {/*    </form> */}
      {/*  </div> */}
      {/* )} */}
      {widgets?.map((widget, index) => {
        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FEATURED_LEAGUES) {
          return <FeaturedLeagueSideWidget key={index} widgetData={widget?.data} />;
        }

        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_SPORTS_TREE) {
          return <SportsTreeSideWidget key={index} widgetData={widget?.data} />;
        }

        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BANNER_ADS) {
          return <BannerAdsSideWidget key={index} widgetData={widget?.data} />;
        }

        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BETSLIPS) {
          return <BetslipSideWidget key={index} widgetData={widget?.data} />;
        }

        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MENU) {
          return <MenuSideWidget key={index} widgetData={widget?.data} />;
        }

        if (widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_IFRAME) {
          return <IFrameSideWidget key={index} widgetData={widget?.data} />;
        }

        return null;
      })}
    </aside>
  );
};

SideColumn.propTypes = propTypes;
SideColumn.defaultProps = defaultProps;
export default React.memo(SideColumn);
