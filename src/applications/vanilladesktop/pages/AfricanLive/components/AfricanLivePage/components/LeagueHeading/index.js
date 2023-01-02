import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const propTypes = {
  sportCode: PropTypes.string.isRequired,
};

const LeagueHeading = ({ sportCode }) => {
  const sports = useSelector((state) => state.sport.sports);

  return (
    <h3 className={classes["main-title"]}>
      <div className={classes["main-title__sport"]}>
        <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode?.toLowerCase()}`])} />
      </div>
      <p className={classes["main-title__text"]}>{sportCode && sports ? sports[sportCode].description : ""}</p>
    </h3>
  );
};

LeagueHeading.propTypes = propTypes;

export default LeagueHeading;
