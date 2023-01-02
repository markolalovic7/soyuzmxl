import cx from "classnames";
import PropTypes from "prop-types";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { getHrefPrematch } from "utils/route-href";

import classes from "../../../../styles/index.module.scss";

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
    <Link
      className={`${classes["link_featured_league"]} ${
        location.pathname === getHrefPrematch(`p${eventPathId}`) ? classes.active : ""
      }`}
      to={getHrefPrematch(`p${eventPathId}`)}
      onClick={onClick}
    >
      <span
        className={cx(
          classes["link_featured_league__icon"],
          classes["qicon-default"],
          classes[`qicon-${sportCode.toLowerCase()}`],
        )}
      />
      <span className={`${classes["link_featured_league__title"]}`}>{title}</span>
      {isLiveBadge && <span className={classes["link_featured_league__icon_live"]}>{t("live")}</span>}
    </Link>
  );
};

SectionFeaturedLeagueLink.propTypes = propTypes;
SectionFeaturedLeagueLink.defaultProps = defaultProps;

export default memo(SectionFeaturedLeagueLink);
