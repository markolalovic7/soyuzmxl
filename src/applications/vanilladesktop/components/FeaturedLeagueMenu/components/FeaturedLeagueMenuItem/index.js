import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import * as PropTypes from "prop-types";
import { useHistory } from "react-router";

const FeaturedLeagueMenuItem = ({ eventPathId, isLiveBadge, sportCode, title }) => {
  const history = useHistory();

  return (
    <div className={classes["left-section__card"]} onClick={() => history.push(`/prematch/eventpath/${eventPathId}`)}>
      <span className={classes["menu-sports__item-icon"]}>
        <span className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
      </span>
      <span className={classes["left-section__text"]}>{title}</span>
      {isLiveBadge && <span className={classes["menu-sports__item-live"]}>Live</span>}{" "}
    </div>
  );
};

FeaturedLeagueMenuItem.propTypes = {
  eventPathId: PropTypes.number.isRequired,
  isLiveBadge: PropTypes.bool.isRequired,
  sportCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default FeaturedLeagueMenuItem;
