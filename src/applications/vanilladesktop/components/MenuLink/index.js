import * as PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { APPLICATION_TYPE_ASIAN_DESKTOP } from "../../../../constants/application-types";
import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../../../../constants/navigation-drawer";
import { getAuthDesktopView } from "../../../../redux/reselect/auth-selector";
import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../redux/reselect/cms-selector";
import { getHrefContentPage } from "../../../../utils/route-href";
import {
  getAsianDesktopRouteByInternalComponent,
  getVanillaDesktopRouteByInternalComponent,
} from "../../utils/navigationMenus";

const propTypes = {
  children: PropTypes.object.isRequired,
  linkEnabled: PropTypes.bool.isRequired,
  navigationData: PropTypes.object,
};

const defaultProps = {
  navigationData: undefined,
};

const MenuLink = ({ children, linkEnabled, navigationData }) => {
  const view = useSelector(getAuthDesktopView);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (!linkEnabled) return children;

  if (!navigationData) return null; // bad data...

  const { component, link, modifiers, type, url } = navigationData;

  if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
    return (
      <Link rel="noopener noreferrer" target="_blank" to={{ pathname: url }}>
        {children}
      </Link>
    );
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
    return <Link to={link}>{children}</Link>;
  }
  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
    const { PAGE_CONTENT_ID } = modifiers;

    const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

    return <Link to={contentPagePath}>{children}</Link>;
  }
  if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
    const href =
      view === APPLICATION_TYPE_ASIAN_DESKTOP
        ? getAsianDesktopRouteByInternalComponent(component)
        : getVanillaDesktopRouteByInternalComponent(component);

    return <Link to={href}>{children}</Link>;
  }

  return null;
};

MenuLink.propTypes = propTypes;
MenuLink.defaultProps = defaultProps;

export default React.memo(MenuLink);
