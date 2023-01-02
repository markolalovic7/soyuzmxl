import PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {};

const StatsButton = ({ onClick }) => (
  <div className={classes["bet__icon"]} onClick={onClick}>
    <i className={classes["qicon-stats"]} />
  </div>
);

StatsButton.propTypes = propTypes;
StatsButton.defaultProps = defaultProps;

export default StatsButton;
