import * as PropTypes from "prop-types";

import classes from "../../../../scss/vanillamobilestyle.module.scss";

const ExpandMarketsButton = ({ active, marketCount, onClick }) => (
  <div
    className={`${classes["bet__icon"]} ${active ? classes["active"] : ""}`}
    style={{ opacity: marketCount > 0 ? 1 : 0.5, pointerEvents: marketCount > 0 ? "auto" : "none" }}
    onClick={onClick}
  >
    {`+${marketCount}`}
  </div>
);

ExpandMarketsButton.propTypes = {
  active: PropTypes.bool.isRequired,
  marketCount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ExpandMarketsButton;
