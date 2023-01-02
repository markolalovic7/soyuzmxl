import cx from "classnames";
import PropTypes from "prop-types";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getHrefPrematch } from "utils/route-href";

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  isLiveBadge: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  isLiveBadge: false,
};

const SectionFeaturedLeagueLink = ({ eventPathId, isLiveBadge, onClick, sportCode, title }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <li className={classes["overlay-burger__item"]}>
      <Link
        className={`${classes["overlay-burger__content"]} ${
          location.pathname === getHrefPrematch(eventPathId) ? classes["active"] : ""
        }`}
        to={getHrefPrematch(eventPathId)}
        onClick={onClick}
      >
        <span
          className={cx(
            classes["overlay-burger__icon"],
            classes["qicon-default"],
            classes[`qicon-${sportCode?.toLowerCase()}`],
          )}
        />
        <span className={`${classes["overlay-burger__title"]}`}>{title}</span>
        {isLiveBadge && <span className={classes["overlay-burger__live"]}>{t("live")}</span>}
      </Link>
    </li>
  );
};

SectionFeaturedLeagueLink.propTypes = propTypes;
SectionFeaturedLeagueLink.defaultProps = defaultProps;

export default memo(SectionFeaturedLeagueLink);
