import PropTypes from "prop-types";
import { memo } from "react";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  description: PropTypes.string.isRequired,
  dir: PropTypes.string,
  eventId: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  outcomeId: PropTypes.number.isRequired,
  period: PropTypes.string,
};
const defaultProps = {
  dir: undefined,
  isActive: false,
  isDisabled: false,
  period: undefined,
};

const JackpotOutcomePriceButton = ({ description, dir, eventId, isActive, isDisabled, onClick, outcomeId, period }) => (
  <button
    className={`${classes["bet__coeficient"]} ${
      isActive ? classes["bet__coeficient_active"] : isDisabled ? classes["bet__coeficient_disabled"] : ""
    }`}
    style={{ height: "40px" }}
    type="button"
    onClick={() => onClick(eventId, outcomeId)}
  >
    {dir && (
      <span
        className={`${classes["bet__triangle"]} ${
          {
            d: classes["bet__triangle_red"],
            u: classes["bet__triangle_green"],
          }[dir] ?? ""
        }`}
      />
    )}
    <span className={classes["bet__coeficient-name"]}>
      <span className={classes["bet__coeficient-ellipsis"]}>{description}</span>
      {period && <span>{period}</span>}
    </span>
  </button>
);

JackpotOutcomePriceButton.propTypes = propTypes;
JackpotOutcomePriceButton.defaultProps = defaultProps;

export default memo(JackpotOutcomePriceButton);
