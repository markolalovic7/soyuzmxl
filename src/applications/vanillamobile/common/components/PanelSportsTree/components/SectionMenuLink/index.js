import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import {
  getCmsConfigResultBetradarUrl,
  isCmsConfigResultEnabled,
  isCmsConfigResultTypeBetradar,
} from "../../../../../../../redux/reselect/cms-selector";
import SectionMenuLinkBetradar from "../SectionMenuLinkBetradar";
import SectionMenuLinkKiron from "../SectionMenuLinkKiron";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import {
  INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS,
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
} from "constants/navigation-drawer";
import { getRouteByInternalComponent } from "utils/navigation-drawer";
import { getHrefContentPage } from "utils/route-href";

const propTypes = {
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  navigationData: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  subItems: PropTypes.array,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  className: "overlay-burger__item",
  contentClassName: "overlay-burger__content",
  navigationData: undefined,
  subItems: [],
};

const SectionMenuLink = ({ className, contentClassName, navigationData, onClick, subItems, title }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isResultEnabled = useSelector(isCmsConfigResultEnabled);
  const isBetRadarResults = useSelector(isCmsConfigResultTypeBetradar);
  const betradarResultUrl = useSelector(getCmsConfigResultBetradarUrl);

  if (isEmpty(subItems)) {
    const { component, link, treeLevel, type, url } = navigationData;
    if (type === MENU_ITEM_TYPE_EXTERNAL_LINK) {
      return (
        <li className={classes[className]}>
          <Link
            className={cx(classes[contentClassName], classes["open"])}
            rel="noopener noreferrer"
            target="_blank"
            to={{ pathname: url }}
            onClick={onClick}
          >
            <span className={classes["overlay-burger__title"]}>{title}</span>
          </Link>
        </li>
      );
    }
    if (type === MENU_ITEM_TYPE_INTERNAL_LINK) {
      return (
        <li className={`${classes[className]} ${location.pathname === link ? classes["active"] : ""}`}>
          <Link
            className={cx(classes[contentClassName], classes["open"], {
              [classes["active"]]: location.pathname === link,
            })}
            to={link}
            onClick={onClick}
          >
            <span className={classes["overlay-burger__title"]}>{title}</span>
          </Link>
        </li>
      );
    }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_KIRON_VIRTUAL_SPORTS) {
      return <SectionMenuLinkKiron title={title} treeLevel={treeLevel} onClick={onClick} />;
    }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_BETRADAR_VIRTUAL_SPORTS) {
      return <SectionMenuLinkBetradar title={title} treeLevel={treeLevel} onClick={onClick} />;
    }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
      const {
        modifiers: { PAGE_CONTENT_ID },
      } = navigationData;

      return (
        <li
          className={`${classes[className]} ${
            location.pathname === getHrefContentPage(PAGE_CONTENT_ID) ? classes["active"] : ""
          }`}
        >
          <Link
            className={cx(classes[contentClassName], classes["open"], {
              [classes["active"]]: location.pathname === getHrefContentPage(PAGE_CONTENT_ID),
            })}
            to={getHrefContentPage(PAGE_CONTENT_ID)}
            onClick={onClick}
          >
            <span className={classes["overlay-burger__title"]}>{title}</span>
          </Link>
        </li>
      );
    }

    if (component === INTERNAL_NAMED_COMPONENT_TYPE_RESULTS && isResultEnabled && isBetRadarResults) {
      return (
        <li className={`${classes[className]}`}>
          <Link
            className={cx(classes[contentClassName], classes["open"])}
            rel="noopener noreferrer"
            target="_blank"
            to={{ pathname: betradarResultUrl }} // https://ls.sir.sportradar.com/p8tech
            onClick={onClick}
          >
            <span className={classes["overlay-burger__title"]}>{title}</span>
          </Link>
        </li>
      );
    }

    const href = getRouteByInternalComponent(component);

    return (
      <li className={`${classes[className]} ${location.pathname === href ? classes["active"] : ""}`}>
        <Link
          className={cx(classes[contentClassName], classes["open"], {
            [classes["active"]]: location.pathname === href,
          })}
          to={href}
          onClick={onClick}
        >
          <span className={classes["overlay-burger__title"]}>{title}</span>
        </Link>
      </li>
    );
  }

  const onMenuLinkExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className={classes[className]}>
      <div className={cx(classes[contentClassName], classes["open"])} onClick={onMenuLinkExpandClick}>
        <span className={classes["overlay-burger__title"]}>{title}</span>
        <div
          className={`${classes["overlay-burger__arrow"]} ${classes["overlay-burger__arrow1"]} ${
            isExpanded ? classes["active"] : ""
          }`}
          onClick={onMenuLinkExpandClick}
        />
      </div>

      {isExpanded && (
        <ul className={classes["overlay-burger__sublist"]}>
          {subItems.map((subItem) => (
            <SectionMenuLink
              className="overlay-burger__subitem"
              contentClassName="overlay-burger__subitem-content"
              key={subItem.id}
              navigationData={subItem.navigationData}
              title={subItem.description}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

SectionMenuLink.propTypes = propTypes;
SectionMenuLink.defaultProps = defaultProps;

export default memo(SectionMenuLink);
