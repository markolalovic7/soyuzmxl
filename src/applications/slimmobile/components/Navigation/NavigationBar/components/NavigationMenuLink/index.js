import {
  INTERNAL_NAMED_COMPONENT_TYPE_BET_CALCULATOR,
  INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_JACKPOTS,
  INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "constants/navigation-drawer";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getHrefContentPage } from "utils/route-href";

import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../../../redux/reselect/cms-selector";
import classes from "../../styles/index.module.scss";
import { getNavigationMenuLink } from "../../utils";

const propTypes = {
  classNameLinkTitle: PropTypes.string,
  classNameLinkWrapper: PropTypes.string,
  navigationData: PropTypes.object,
  onLinkClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  classNameLinkTitle: "navigation-menu-link-title",
  classNameLinkWrapper: "navigation-menu-link",
  navigationData: undefined,
};

const NavigationMenuLink = ({ classNameLinkTitle, classNameLinkWrapper, navigationData, onLinkClick, title }) => {
  const { component, type } = navigationData;
  const url = getNavigationMenuLink(navigationData);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (!url) {
    return null;
  }

  if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
    return (
      <Link
        className={classes[classNameLinkTitle]}
        rel="noopener noreferrer"
        target="_blank"
        to={{ pathname: url }}
        onClick={onLinkClick}
      >
        <span className={classes[classNameLinkWrapper]}>{title}</span>
      </Link>
    );
  }

  if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
    return (
      <Link className={classes[classNameLinkWrapper]} to={url} onClick={onLinkClick}>
        <span className={classes[classNameLinkTitle]}>{title}</span>
      </Link>
    );
  }

  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
    const {
      modifiers: { PAGE_CONTENT_ID },
    } = navigationData;

    return (
      <Link className={classes[classNameLinkWrapper]} to={getHrefContentPage(PAGE_CONTENT_ID)} onClick={onLinkClick}>
        <span className={classes[classNameLinkTitle]}>{title}</span>
      </Link>
    );
  }

  if (type === MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT) {
    // Filter unsupported types
    if (
      [
        INTERNAL_NAMED_COMPONENT_TYPE_BET_CALCULATOR,
        INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS,
        INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS,
        INTERNAL_NAMED_COMPONENT_TYPE_JACKPOTS,
      ].includes(component)
    )
      return null;

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
      return (
        <Link
          className={classes[classNameLinkWrapper]}
          rel="noopener noreferrer"
          target="_blank"
          to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
          onClick={onLinkClick}
        >
          <span className={classes[classNameLinkTitle]}>{title}</span>
        </Link>
      );
    }

    return (
      <Link className={classes[classNameLinkWrapper]} to={url} onClick={onLinkClick}>
        <span className={classes[classNameLinkTitle]}>{title}</span>
      </Link>
    );
  }

  return null;
};

NavigationMenuLink.propTypes = propTypes;
NavigationMenuLink.defaultProps = defaultProps;

export default React.memo(NavigationMenuLink);
