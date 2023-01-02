import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigBetradarVirtual } from "redux/reselect/cms-selector";
import { getBetradarFeedCodeTranslated } from "utils/betradar-virtual-sport";
import { getHrefBetradarVirtualSport } from "utils/route-href";
import { getPatternBetradarVirtualSport } from "utils/route-patterns";

const propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  treeLevel: PropTypes.number.isRequired,
};

const defaultProps = {};

const SectionMenuLinkBetradar = ({ onClick, title, treeLevel }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigBetradarVirtual || { data: {} };

  if (isEmpty(feedCodes)) {
    return null;
  }

  const { pathname } = location;
  const match = matchPath(pathname, getPatternBetradarVirtualSport());

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
            className={`${classes["overlay-burger__sublist"]} ${
              match?.params?.feedCode === feedCode ? classes["active"] : ""
            }`}
            key={feedCode}
          >
            <Link
              className={cx(classes["overlay-burger__subitem-content"], classes["open"])}
              to={getHrefBetradarVirtualSport(feedCode)}
              onClick={onClick}
            >
              <span className={classes["overlay-burger__title"]}>{getBetradarFeedCodeTranslated(feedCode, t)}</span>
            </Link>
          </li>
        ))}
    </>
  );
};

SectionMenuLinkBetradar.propTypes = propTypes;
SectionMenuLinkBetradar.defaultProps = defaultProps;

export default memo(SectionMenuLinkBetradar);
