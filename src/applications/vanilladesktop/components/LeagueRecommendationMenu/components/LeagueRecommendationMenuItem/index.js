import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

const propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
const LeagueRecommendationMenuItem = ({ data: { code, description, pathId, sportCode }, onClick }) => (
  <div className={classes["left-section__card"]}>
    <span className={classes["left-section__icon"]}>
      <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
    </span>
    <span
      className={classes["left-section__text"]}
      style={{ fontSize: "15px" }}
      onClick={() => onClick(code, pathId, sportCode.substr(1, sportCode.length))}
    >
      {description}
    </span>
  </div>
);

LeagueRecommendationMenuItem.propTypes = propTypes;

export default LeagueRecommendationMenuItem;
