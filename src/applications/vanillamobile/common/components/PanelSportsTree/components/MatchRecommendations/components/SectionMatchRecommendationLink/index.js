import cx from "classnames";
import PropTypes from "prop-types";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getHrefPrematchEvent } from "utils/route-href";

const propTypes = {
  description: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  eventPathId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const SectionMatchRecommendationLink = ({ description, eventId, eventPathId, onClose, sportCode }) => {
  const location = useLocation();

  return (
    <li className={classes["overlay-burger__item"]}>
      <Link
        className={`${classes["overlay-burger__content"]} ${
          location.pathname === getHrefPrematchEvent(`p${eventPathId}`, `e${eventId}`) ? classes.active : ""
        }`}
        to={getHrefPrematchEvent(`p${eventPathId}`, `e${eventId}`)}
        onClick={onClose}
      >
        {/* <Link */}
        {/*    className={`${classes["link_featured_league"]} ${ */}
        {/*        location.pathname === getHrefPrematch(`p${eventPathId}`) ? classes.active : "" */}
        {/*    }`} */}
        {/*    to={getHrefPrematch(`p${eventPathId}`)} */}
        {/*    onClick={onClose} */}
        {/* > */}
        <span
          className={cx(
            classes["overlay-burger__icon"],
            classes["qicon-default"],
            classes[`qicon-${sportCode.toLowerCase()}`],
          )}
        />
        <span className={`${classes["overlay-burger__title"]}`} style={{ fontSize: "15px" }}>
          {description}
        </span>
      </Link>
    </li>
  );
};

SectionMatchRecommendationLink.propTypes = propTypes;

export default memo(SectionMatchRecommendationLink);
