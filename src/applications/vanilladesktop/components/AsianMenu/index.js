import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  CMS_LAYOUT_WIDGET_TYPE_BETSLIPS,
  CMS_LAYOUT_WIDGET_TYPE_FAVOURITES,
  CMS_LAYOUT_WIDGET_TYPE_MENU,
} from "../../../../constants/cms-layout-widget-types";
import { getAuthLoggedIn } from "../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { getCmsLayoutDesktopWidgetsLeftColumn } from "../../../../redux/reselect/cms-layout-widgets";
import AsianMenuFavourites from "../AsianMenuFavourites";
import AsianMenuLinks from "../AsianMenuLinks";
import AsianMenuSports from "../AsianMenuSports";
import BetslipPanel from "../BetslipPanel/components";

import { ASIAN_MENU_TABS } from "./constants";

const AsianMenu = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(ASIAN_MENU_TABS.Sports);
  const location = useLocation();
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);

  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsLeftColumn(state, location));

  const betslipWidget = widgets?.find((widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_BETSLIPS);
  const favouriteWidget = widgets?.find((widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_FAVOURITES);
  const menuWidget = widgets?.find((widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MENU);

  return (
    <div className={classes["asian-menu"]}>
      <div className={classes["asian-menu__tabs"]}>
        <div
          className={cx(classes["asian-menu__tab"], classes["asian-menu__tab_sports"], {
            [classes["active"]]: selectedTab === ASIAN_MENU_TABS.Sports,
          })}
          onClick={() => setSelectedTab(ASIAN_MENU_TABS.Sports)}
        >
          <span className={classes["asian-menu__icon"]}>
            <i className={classes["qicon-futs"]} />
          </span>
          <span className={classes["asian-menu__tab-text"]}>{t("sports")}</span>
        </div>
        {betslipWidget && (
          <div
            className={cx(classes["asian-menu__tab"], classes["asian-menu__tab_betslip"], {
              [classes["active"]]: selectedTab === ASIAN_MENU_TABS.Betslip,
            })}
            onClick={() => setSelectedTab(ASIAN_MENU_TABS.Betslip)}
          >
            <span className={classes["asian-menu__icon"]}>
              <i className={classes["qicon-money"]}> </i>
              <span className={classes["asian-menu__indicator"]}>{betslipOutcomeIds.length}</span>
            </span>
            <span className={classes["asian-menu__tab-text"]}>{t("betslip")}</span>
          </div>
        )}
        {isLoggedIn && favouriteWidget && (
          <div
            className={cx(classes["asian-menu__tab"], classes["asian-menu__tab_favourites"], {
              [classes["active"]]: selectedTab === ASIAN_MENU_TABS.Favourites,
            })}
            onClick={() => setSelectedTab(ASIAN_MENU_TABS.Favourites)}
          >
            <span className={classes["asian-menu__icon"]}>
              <i className={classes["qicon-star-full"]} />
            </span>

            <span className={classes["asian-menu__tab-text"]}>{t("favourites")}</span>
          </div>
        )}
        {menuWidget && (
          <div
            className={cx(classes["asian-menu__tab"], classes["asian-menu__tab_links"], {
              [classes["active"]]: selectedTab === ASIAN_MENU_TABS.Links,
            })}
            onClick={() => setSelectedTab(ASIAN_MENU_TABS.Links)}
          >
            <span className={classes["asian-menu__icon"]}>
              <FontAwesomeIcon icon={faLink} />
            </span>

            <span className={classes["asian-menu__tab-text"]}>{t("quick_links")}</span>
          </div>
        )}
      </div>

      <AsianMenuSports active={selectedTab === ASIAN_MENU_TABS.Sports} />
      {selectedTab === ASIAN_MENU_TABS.Betslip && (
        <BetslipPanel betslipWidget={betslipWidget?.data} displayHeader={false} />
      )}
      {/* <AsianMenuBetslip active={selectedTab === ASIAN_MENU_TABS.Betslip} /> */}
      {isLoggedIn && favouriteWidget && (
        <AsianMenuFavourites active={selectedTab === ASIAN_MENU_TABS.Favourites} favouriteWidget={favouriteWidget} />
      )}
      {menuWidget && <AsianMenuLinks active={selectedTab === ASIAN_MENU_TABS.Links} menuWidget={menuWidget} />}
    </div>
  );
};

export default React.memo(AsianMenu);
