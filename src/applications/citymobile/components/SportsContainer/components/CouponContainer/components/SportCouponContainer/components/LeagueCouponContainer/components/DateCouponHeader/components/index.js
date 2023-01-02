import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { getAuthTimezoneOffset } from "../../../../../../../../../../../../../redux/reselect/auth-selector";
import classes from "../../../../../../../../../../../scss/citymobile.module.scss";

const DateCouponHeader = ({ dateIndex, eventCount, onToggleSection }) => {
  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const date = dayjs().utcOffset(timezoneOffset).add(dateIndex, "day");

  return (
    <div
      className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${classes["active"]}`}
      onClick={onToggleSection}
    >
      <span className={classes["sports-spoiler__item-text"]}>
        {`${date.calendar().split(" ")[0]} ${date.format("MMMM DD")} (${eventCount})`}
      </span>
    </div>
  );
};

const propTypes = {
  dateIndex: PropTypes.number.isRequired,
  eventCount: PropTypes.number.isRequired,
  onToggleSection: PropTypes.func.isRequired,
};

const defaultProps = {};

DateCouponHeader.propTypes = propTypes;
DateCouponHeader.defaultProps = defaultProps;

export default React.memo(DateCouponHeader);
