import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

const propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
const MatchRecommendationMenuItem = ({ data: { description, sportCode }, onClick }) => (
  <div className={classes["left-section__card"]}>
    <span className={classes["menu-sports__item-icon"]}>
      <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
    </span>
    <span className={classes["left-section__text"]} style={{ fontSize: "15px" }} onClick={onClick}>
      {`${description}`}
    </span>
  </div>
);

MatchRecommendationMenuItem.propTypes = propTypes;

export default MatchRecommendationMenuItem;
