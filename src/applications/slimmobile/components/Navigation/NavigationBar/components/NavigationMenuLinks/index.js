import isEmpty from "lodash.isempty";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getCmsLayoutMobileSlimWidgetHeaderNavigationMenu } from "redux/reselect/cms-layout-widgets";
import { isNotEmpty } from "utils/lodash";

import classes from "../../styles/index.module.scss";
import MenuCarousel from "../MenuCarousel";
import NavigationMenuLink from "../NavigationMenuLink";

const propTypes = {};

const defaultProps = {};

const NavigationMenuLinks = () => {
  const location = useLocation();
  const { pathname } = location;
  const [activeMenuPanelId, setActiveMenuPanelId] = useState();

  const widgetNavigationMenu = useSelector((state) =>
    getCmsLayoutMobileSlimWidgetHeaderNavigationMenu(state, location),
  );

  const {
    data: { children: menuLinks },
  } = widgetNavigationMenu || { data: {} };

  useEffect(() => {
    setActiveMenuPanelId(null);
  }, [pathname]);

  const onBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setActiveMenuPanelId(null);
    }
  }, []);

  const onResetActivePanel = useCallback(() => {
    setActiveMenuPanelId(null);
  }, []);

  if (isEmpty(menuLinks)) {
    return <div className={classes["navigation-menu"]} />;
  }

  const renderMenuPanel = () => {
    const menuPanel = menuLinks.find((menuLink) => menuLink.id === activeMenuPanelId);
    if (!menuPanel) {
      return null;
    }

    return (
      <div className={`${classes["navigation-menu-extended"]} ${classes["active"]}`} onClick={onBackdropClick}>
        <div className={classes["navigation-menu-extended-container"]}>
          {menuPanel.children.map((subItem) => (
            <NavigationMenuLink
              classNameLinkTitle="none"
              classNameLinkWrapper="navigation-menu-extended-button"
              key={subItem.id}
              navigationData={subItem.navigationData}
              title={subItem.description}
              onLinkClick={onResetActivePanel}
            />
          ))}
        </div>
        <MenuCarousel />
      </div>
    );
  };

  return (
    <ul className={classes["navigation-menu"]}>
      {menuLinks.map((menu) => {
        if (isNotEmpty(menu.children)) {
          return (
            <div
              className={classes["navigation-menu-link"]}
              key={menu.id}
              onClick={() => setActiveMenuPanelId(menu.id !== activeMenuPanelId ? menu.id : null)}
            >
              <div
                className={`${classes["navigation-menu-link-title"]} ${
                  classes[menu.id === activeMenuPanelId ? "active" : "none"]
                }`}
              >
                {menu.description}
              </div>
            </div>
          );
        }

        return (
          <NavigationMenuLink
            key={menu.id}
            navigationData={menu.navigationData}
            title={menu.description}
            onLinkClick={onResetActivePanel}
          />
        );
      })}
      {activeMenuPanelId && renderMenuPanel()}
    </ul>
  );
};

NavigationMenuLinks.propTypes = propTypes;
NavigationMenuLinks.defaultProps = defaultProps;

export default NavigationMenuLinks;
