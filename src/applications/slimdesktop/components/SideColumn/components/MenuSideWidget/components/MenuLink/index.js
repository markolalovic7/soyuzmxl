import * as PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../../../../../../../../constants/navigation-drawer";
import { getAuthDesktopView } from "../../../../../../../../redux/reselect/auth-selector";
import { getHrefContentPage } from "../../../../../../../../utils/route-href";
import { getSlimDesktopRouteByInternalComponent } from "../../../../../../utils/navigationMenus";

const propTypes = {
  children: PropTypes.object.isRequired,
  linkEnabled: PropTypes.bool.isRequired,
  navigationData: PropTypes.object.isRequired,
};

const MenuLink = ({ children, linkEnabled, navigationData }) => {
  const view = useSelector(getAuthDesktopView);

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
    const href = getSlimDesktopRouteByInternalComponent(component);

    return <Link to={href}>{children}</Link>;
  }

  return null;
};

MenuLink.propTypes = propTypes;

export default React.memo(MenuLink);
