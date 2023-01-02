import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { APPLICATION_TYPE_ASIAN_DESKTOP } from "../../../../../../constants/application-types";
import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../../../../../../constants/navigation-drawer";
import { getAuthDesktopView } from "../../../../../../redux/reselect/auth-selector";
import { getCmsLayoutDesktopHeaderMenuWidget } from "../../../../../../redux/reselect/cms-layout-widgets";
import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../../redux/reselect/cms-selector";
import { isMenuLinkMatch } from "../../../../../../utils/cms-layouts";
import { getHrefContentPage } from "../../../../../../utils/route-href";
import classes from "../../../../scss/vanilladesktop.module.scss";
import {
  getAsianDesktopRouteByInternalComponent,
  getVanillaDesktopRouteByInternalComponent,
} from "../../../../utils/navigationMenus";

const MenuItem = ({ menuItem }) => {
  const [isExpanded, setIsExpanded] = useState({});
  const location = useLocation();
  const view = useSelector(getAuthDesktopView);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (menuItem.children?.length > 0) {
    return (
      <div
        className={classes["header__optional-dropdown"]}
        style={{ paddingBottom: "8px", paddingTop: "8px", pointer: "none" }}
        onMouseEnter={() =>
          setIsExpanded((prevState) => {
            const newIsExpanded = { ...prevState };
            newIsExpanded[menuItem.id] = true;

            return newIsExpanded;
          })
        }
        onMouseLeave={() =>
          setIsExpanded((prevState) => {
            const newIsExpanded = { ...prevState };
            newIsExpanded[menuItem.id] = false;

            return newIsExpanded;
          })
        }
      >
        <ul className={classes["header__optional-dropdown-list"]}>
          <li>
            <div
              className={cx(classes["header__optional-dropdown-current"], classes["dropdown"], {
                [classes["active"]]: isExpanded[menuItem.id],
              })}
            >
              <span className={classes["header__optional-dropdown-title"]}>{menuItem.description}</span>
            </div>
            <div
              className={cx(classes["header__optional-dropdown-content"], classes["dropdown"], {
                [classes["open"]]: isExpanded[menuItem.id],
              })}
              style={{ top: "calc(100% + 0px)" }}
            >
              <ul>
                {menuItem.children.map((childMenuItem) => {
                  if (!childMenuItem.navigationData) return null;
                  if (childMenuItem.children?.length > 0) return null;
                  const { component, link, type, url } = childMenuItem.navigationData;

                  if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
                    return (
                      <Link
                        className={cx(classes["header__optional-dropdown-theme"], {
                          [classes["active"]]: isMenuLinkMatch(view, childMenuItem.navigationData, location.pathname),
                        })}
                        key={childMenuItem.id}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={{ pathname: url }}
                      >
                        <span className={cx(classes["header__optional-dropdown-label"])}>
                          {childMenuItem.description}
                        </span>
                        <span className={classes["header__optional-dropdown-check"]}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Link>
                    );
                  }
                  if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
                    return (
                      <Link
                        className={cx(classes["header__optional-dropdown-theme"], {
                          [classes["active"]]: isMenuLinkMatch(view, childMenuItem.navigationData, location.pathname),
                        })}
                        key={childMenuItem.id}
                        to={link}
                      >
                        <span className={cx(classes["header__optional-dropdown-label"])}>
                          {childMenuItem.description}
                        </span>
                        <span className={classes["header__optional-dropdown-check"]}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Link>
                    );
                  }
                  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
                    const {
                      modifiers: { PAGE_CONTENT_ID },
                    } = childMenuItem.navigationData;

                    const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

                    return (
                      <Link
                        className={cx(classes["header__optional-dropdown-theme"], {
                          [classes["active"]]: isMenuLinkMatch(view, childMenuItem.navigationData, location.pathname),
                        })}
                        key={childMenuItem.id}
                        to={contentPagePath}
                      >
                        <span className={cx(classes["header__optional-dropdown-label"])}>
                          {childMenuItem.description}
                        </span>
                        <span className={classes["header__optional-dropdown-check"]}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Link>
                    );
                  }
                  if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
                    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
                      return (
                        <Link
                          className={classes["header__optional-dropdown-theme"]}
                          key={childMenuItem.id}
                          rel="noopener noreferrer"
                          target="_blank"
                          to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
                        >
                          <span>{childMenuItem.description}</span>
                        </Link>
                      );
                    }

                    const href =
                      view === APPLICATION_TYPE_ASIAN_DESKTOP
                        ? getAsianDesktopRouteByInternalComponent(component)
                        : getVanillaDesktopRouteByInternalComponent(component);

                    return (
                      <Link
                        className={cx(classes["header__optional-dropdown-theme"], {
                          [classes["active"]]: isMenuLinkMatch(view, childMenuItem.navigationData, location.pathname),
                        })}
                        key={childMenuItem.id}
                        to={href}
                      >
                        <span className={cx(classes["header__optional-dropdown-label"])}>
                          {childMenuItem.description}
                        </span>
                        <span className={classes["header__optional-dropdown-check"]}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Link>
                    );
                  }

                  return null;
                })}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  if (!menuItem.navigationData) return null;

  const { component, link, type, url } = menuItem.navigationData;
  if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
    return (
      <Link
        className={cx(classes["header__link"], {
          [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
        })}
        key={menuItem.id}
        rel="noopener noreferrer"
        target="_blank"
        to={{ pathname: url }}
      >
        {menuItem.description}
      </Link>
    );
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
    return (
      <Link
        className={cx(classes["header__link"], {
          [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
        })}
        key={menuItem.id}
        to={link}
      >
        {menuItem.description}
      </Link>
    );
  }
  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
    const {
      modifiers: { PAGE_CONTENT_ID },
    } = menuItem.navigationData;

    const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

    return (
      <Link
        className={cx(classes["header__link"], {
          [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
        })}
        key={menuItem.id}
        to={contentPagePath}
      >
        {menuItem.description}
      </Link>
    );
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
      return (
        <Link
          className={classes["header__link"]}
          key={menuItem.id}
          rel="noopener noreferrer"
          target="_blank"
          to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
        >
          {menuItem.description}
        </Link>
      );
    }

    const href =
      view === APPLICATION_TYPE_ASIAN_DESKTOP
        ? getAsianDesktopRouteByInternalComponent(component)
        : getVanillaDesktopRouteByInternalComponent(component);

    return (
      <Link
        className={cx(classes["header__link"], {
          [classes["active"]]: isMenuLinkMatch(view, menuItem.navigationData, location.pathname),
        })}
        key={menuItem.id}
        to={href}
      >
        {menuItem.description}
      </Link>
    );
  }

  return null;
};

MenuItem.propTypes = {
  menuItem: PropTypes.object.isRequired,
};

const HeaderLinks = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const headerWidget = useSelector((state) => getCmsLayoutDesktopHeaderMenuWidget(state, location));

  const availablePromotions = useSelector((state) => state.bonus.availablePromotions);

  return (
    <div className={classes["header__optional-dropdowns"]}>
      {headerWidget?.children?.map((menu) => (
        <MenuItem key={menu.id} menuItem={menu} />
      ))}
    </div>
  );
};

export default React.memo(HeaderLinks);
