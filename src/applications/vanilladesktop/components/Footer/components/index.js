import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { APPLICATION_TYPE_ASIAN_DESKTOP } from "../../../../../constants/application-types";
import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../../../../../constants/navigation-drawer";
import { getCachedAssets } from "../../../../../redux/reselect/assets-selectors";
import { getAuthDesktopView } from "../../../../../redux/reselect/auth-selector";
import { getCmsLayoutVanillaDesktopFooterMenuWidget } from "../../../../../redux/reselect/cms-layout-widgets";
import {
  getCmsConfigBrandLogos,
  getCmsConfigBrandName,
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../redux/reselect/cms-selector";
import { getHrefContentPage } from "../../../../../utils/route-href";
import {
  getAsianDesktopRouteByInternalComponent,
  getVanillaDesktopRouteByInternalComponent,
} from "../../../utils/navigationMenus";
import Chat from "../../Chat";

const Footer = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const brandName = useSelector(getCmsConfigBrandName);
  const footerWidget = useSelector((state) => getCmsLayoutVanillaDesktopFooterMenuWidget(state, location));
  const view = useSelector(getAuthDesktopView);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);

  return (
    <footer className={classes["footer"]}>
      <div className={classes["footer__top"]}>
        <div className={classes["footer__links"]}>
          {footerWidget?.children?.map((menu) => {
            if (!menu.navigationData) return null;
            if (menu?.children?.length > 0) return null;

            const { component, link, type, url } = menu.navigationData;
            if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
              return (
                <Link
                  className={cx(classes["footer__link"], { [classes["active"]]: location.pathname === link })}
                  key={menu.id}
                  rel="noopener noreferrer"
                  target="_blank"
                  to={{ pathname: url }}
                >
                  <span>{menu.description}</span>
                </Link>
              );
            }
            if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
              return (
                <Link
                  className={cx(classes["footer__link"], { [classes["active"]]: location.pathname === link })}
                  key={menu.id}
                  to={link}
                >
                  <span>{menu.description}</span>
                </Link>
              );
            }
            if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
              const {
                modifiers: { PAGE_CONTENT_ID },
              } = menu.navigationData;

              const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

              return (
                <Link
                  className={cx(classes["footer__link"], {
                    [classes["active"]]: location.pathname === contentPagePath,
                  })}
                  key={menu.id}
                  to={contentPagePath}
                >
                  <span>{menu.description}</span>
                </Link>
              );
            }
            if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
              if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
                return (
                  <Link
                    className={classes["footer__link"]}
                    key={menu.id}
                    rel="noopener noreferrer"
                    target="_blank"
                    to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
                  >
                    <span>{menu.description}</span>
                  </Link>
                );
              }

              const href =
                view === APPLICATION_TYPE_ASIAN_DESKTOP
                  ? getAsianDesktopRouteByInternalComponent(component)
                  : getVanillaDesktopRouteByInternalComponent(component);

              return (
                <Link
                  className={cx(classes["footer__link"], { [classes["active"]]: location.pathname === href })}
                  key={menu.id}
                  to={href}
                >
                  <span>{menu.description}</span>
                </Link>
              );
            }

            return null;
          })}
        </div>
        {/* <a className={classes["footer__anchor"]} href="#top"> */}
        {/*  <span> */}
        {/*    <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"> */}
        {/*      <g> */}
        {/*        <g> */}
        {/*          <path */}
        {/*            d="M9.01 16H6.99V3.879L1.434 9.434 0 8l8-8 8 8-1.434 1.434L9.01 3.88z" */}
        {/*            fill="#000000" */}
        {/*            fillOpacity=".54" */}
        {/*          /> */}
        {/*        </g> */}
        {/*      </g> */}
        {/*    </svg> */}
        {/*  </span> */}
        {/*  <span>Back to top</span> */}
        {/* </a> */}
      </div>
      <div className={classes["footer__bottom"]}>
        <Link className={classes["footer__logo"]} to="/">
          {assets[brandLogoAssetId] && <img alt="logo" src={assets[brandLogoAssetId]} />}
        </Link>
        <span className={classes["footer__copyright"]}>
          {`${t("copyright")} © ${dayjs().format("YYYY")} | ${brandName} | ${t("all_rights_reserved")}`}
        </span>
      </div>
      <Chat />
    </footer>
  );
};

export default React.memo(Footer);
