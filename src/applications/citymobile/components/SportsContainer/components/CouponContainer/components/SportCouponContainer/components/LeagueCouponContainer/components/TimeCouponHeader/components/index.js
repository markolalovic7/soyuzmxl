import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../../../scss/citymobile.module.scss";

const TimeCouponHeader = ({ eventCount, onToggleSection, time }) => (
  <div
    className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${classes["active"]}`}
    onClick={onToggleSection}
  >
    <span className={classes["sports-spoiler__item-text"]}>{`${time} (${eventCount})`}</span>
  </div>
);

const propTypes = {
  eventCount: PropTypes.number.isRequired,
  onToggleSection: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
};

const defaultProps = {};

TimeCouponHeader.propTypes = propTypes;
TimeCouponHeader.defaultProps = defaultProps;

export default React.memo(TimeCouponHeader);
