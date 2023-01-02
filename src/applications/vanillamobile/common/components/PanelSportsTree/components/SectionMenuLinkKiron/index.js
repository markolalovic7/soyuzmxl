import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router";
import { Link } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigKironVirtual } from "redux/reselect/cms-selector";
import { getKironFeedCodeTranslated } from "utils/kiron-virtual-sport";
import { getHrefKironVirtualSport } from "utils/route-href";
import { getPatternKironVirtualSport } from "utils/route-patterns";

const propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  treeLevel: PropTypes.number.isRequired,
};

const defaultProps = {};

const SectionMenuLinkKiron = ({ onClick, title, treeLevel }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const cmsConfigKironVirtual = useSelector(getCmsConfigKironVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigKironVirtual || { data: {} };

  if (isEmpty(feedCodes)) {
    return null;
  }
  const { pathname } = location;
  const match = matchPath(pathname, getPatternKironVirtualSport());

  return (
    <>
      <li
        // className={treeLevel >= 3 ? classes["overlay-burger__item"] : classes["overlay-burger__subitem"]}
        className={classes["overlay-burger__item"]}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={classes["overlay-burger__content"]}>
          <span className={classes["overlay-burger__title"]}>{title}</span>
          <div
            className={`${classes["overlay-burger__arrow"]} ${classes["overlay-burger__arrow1"]} ${
              isExpanded ? classes["active"] : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </li>
      {isExpanded &&
        feedCodes.map((feedCode) => (
          <li
            className={`${
              treeLevel >= 3 ? classes["overlay-burger__subsublist"] : classes['"overlay-burger__sublist']
            } ${match?.params?.feedCode === feedCode ? classes["active"] : ""}`}
            key={feedCode}
          >
            <Link
              className={cx(classes["overlay-burger__subitem-content"], classes["open"])}
              to={getHrefKironVirtualSport(feedCode)}
              onClick={onClick}
            >
              <span className={classes["overlay-burger__title"]}>{getKironFeedCodeTranslated(feedCode, t)}</span>
            </Link>
          </li>
        ))}
    </>
  );
};

SectionMenuLinkKiron.propTypes = propTypes;
SectionMenuLinkKiron.defaultProps = defaultProps;

export default memo(SectionMenuLinkKiron);
