import cx from "classnames";
import * as PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../../../../../../../../constants/navigation-drawer";
import { getAuthDesktopView } from "../../../../../../../../redux/reselect/auth-selector";
import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../../../../redux/reselect/cms-selector";
import { isMenuLinkMatch } from "../../../../../../../../utils/cms-layouts";
import { getHrefContentPage } from "../../../../../../../../utils/route-href";
import classes from "../../../../../../scss/slimdesktop.module.scss";
import { getSlimDesktopRouteByInternalComponent } from "../../../../../../utils/navigationMenus";

const SubHeaderMenuItem = ({ children, menuItem, setIsMenuOpen }) => {
  const location = useLocation();
  const view = useSelector(getAuthDesktopView);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (menuItem.children?.length > 0) {
    return null;
  }

  if (!menuItem.navigationData) return null;

  const { component, link, type, url } = menuItem.navigationData;

  if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
    return (
      <li className={classes["navigation-submenu__item"]}>
        <Link
          className={cx(classes["navigation-submenu__link"], {
            [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
          })}
          key={menuItem.id}
          rel="noopener noreferrer"
          target="_blank"
          to={{ pathname: url }}
          onClick={() => setIsMenuOpen(false)}
        >
          {menuItem.description}
        </Link>
        {children}
      </li>
    );
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
    return (
      <li className={classes["navigation-submenu__item"]}>
        <Link
          className={cx(classes["navigation-submenu__link"], {
            [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
          })}
          key={menuItem.id}
          to={link}
          onClick={() => setIsMenuOpen(false)}
        >
          {menuItem.description}
        </Link>
        {children}
      </li>
    );
  }
  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
    const {
      modifiers: { PAGE_CONTENT_ID },
    } = menuItem.navigationData;

    const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

    return (
      <li className={classes["navigation-submenu__item"]}>
        <Link
          className={cx(classes["navigation-submenu__link"], {
            [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
          })}
          key={menuItem.id}
          to={contentPagePath}
          onClick={() => setIsMenuOpen(false)}
        >
          {menuItem.description}
        </Link>
        {children}
      </li>
    );
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
      return (
        <li className={classes["navigation-submenu__item"]}>
          <Link
            className={classes["navigation-submenu__link"]}
            key={menuItem.id}
            rel="noopener noreferrer"
            target="_blank"
            to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
            onClick={() => setIsMenuOpen(false)}
          >
            {menuItem.description}
          </Link>
          {children}
        </li>
      );
    }

    const href = getSlimDesktopRouteByInternalComponent(component);

    return (
      <li className={classes["navigation-submenu__item"]}>
        <Link
          className={cx(classes["navigation-submenu__link"], {
            [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
          })}
          key={menuItem.id}
          to={href}
          onClick={() => setIsMenuOpen(false)}
        >
          {menuItem.description}
        </Link>
        {children}
      </li>
    );
  }

  return null;
};

SubHeaderMenuItem.propTypes = {
  children: PropTypes.object.isRequired,
  menuItem: PropTypes.object.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
};

export default React.memo(SubHeaderMenuItem);
