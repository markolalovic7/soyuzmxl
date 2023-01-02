import {
  INTERNAL_NAMED_COMPONENT_TYPE_BET_CALCULATOR,
  INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_JACKPOTS,
  INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
} from "constants/navigation-drawer";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRouteByInternalComponent } from "utils/navigation-drawer";
import { getHrefContentPage } from "utils/route-href";

import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../../../redux/reselect/cms-selector";
import classes from "../../styles/index.module.scss";

const propTypes = {
  className: PropTypes.string,
  navigationData: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  subItems: PropTypes.array,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  className: "link_menu",
  navigationData: undefined,
  subItems: [],
};

const SectionMenuLink = ({ className, navigationData, onClick, subItems, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (isEmpty(subItems)) {
    const { component, link, type, url } = navigationData;
    if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
      return (
        <Link
          className={classes[className]}
          rel="noopener noreferrer"
          target="_blank"
          to={{ pathname: url }}
          onClick={onClick}
        >
          <span>{title}</span>
        </Link>
      );
    }

    if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
      return (
        <Link className={classes[className]} to={link} onClick={onClick}>
          <span>{title}</span>
        </Link>
      );
    }

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

    // if (component === INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS) {
    //   return <SectionMenuLinkKiron title={title} onClick={onClick} />;
    // }
    //
    // // TODO: implement.
    // if (component === INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS) {
    //   return null;
    // }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
      const {
        modifiers: { PAGE_CONTENT_ID },
      } = navigationData;

      return (
        <Link className={classes[className]} to={getHrefContentPage(PAGE_CONTENT_ID)} onClick={onClick}>
          <span>{title}</span>
        </Link>
      );
    }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
      <Link
        className={classes[className]}
        rel="noopener noreferrer"
        target="_blank"
        to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
        onClick={onClick}
      >
        <span>{title}</span>
      </Link>;
    }

    return (
      <Link className={classes[className]} to={getRouteByInternalComponent(component)} onClick={onClick}>
        <span>{title}</span>
      </Link>
    );
  }
  const onMenuLinkExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <li className={classes["link_menu_wrapper"]}>
        <div className={classes[className]} onClick={onMenuLinkExpandClick}>
          <span>{title}</span>
          <div
            className={`${classes["arrow"]} ${classes["arrow1"]} ${isExpanded ? classes["active"] : ""}`}
            onClick={onMenuLinkExpandClick}
          />
        </div>
      </li>
      {isExpanded &&
        subItems.map((subItem) => (
          <SectionMenuLink
            className="link_sub_menu"
            key={subItem.id}
            navigationData={subItem.navigationData}
            title={subItem.description}
            onClick={onClick}
          />
        ))}
    </>
  );
};

SectionMenuLink.propTypes = propTypes;
SectionMenuLink.defaultProps = defaultProps;

export default memo(SectionMenuLink);
