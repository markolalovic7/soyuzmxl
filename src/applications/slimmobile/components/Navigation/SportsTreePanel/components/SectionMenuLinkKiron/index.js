import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCmsConfigKironVirtual } from "redux/reselect/cms-selector";
import { getKironFeedCodeTranslated } from "utils/kiron-virtual-sport";
import { getHrefKironVirtualSport } from "utils/route-href";

import classes from "../../styles/index.module.scss";

const propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const defaultProps = {};

const SectionMenuLinkKiron = ({ onClick, title }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const cmsConfigKironVirtual = useSelector(getCmsConfigKironVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigKironVirtual || { data: {} };

  if (isEmpty(feedCodes)) {
    return null;
  }

  return (
    <>
      <li className={classes["link_menu_wrapper"]} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={classes["link_sub_menu"]}>
          <span>{title}</span>
          <div
            className={`${classes["arrow"]} ${classes["arrow1"]} ${isExpanded ? classes["active"] : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </li>
      {isExpanded &&
        feedCodes.map((feedCode) => (
          <Link
            className={classes["link_sub_sub_menu"]}
            key={feedCode}
            to={getHrefKironVirtualSport(feedCode)}
            onClick={onClick}
          >
            <span>{getKironFeedCodeTranslated(feedCode, t)}</span>
          </Link>
        ))}
    </>
  );
};

SectionMenuLinkKiron.propTypes = propTypes;
SectionMenuLinkKiron.defaultProps = defaultProps;

export default memo(SectionMenuLinkKiron);
