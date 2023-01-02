import { faClock } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

import { getDatejsHour } from "../../../../../../../utils/dayjs";
import classes from "../styles/index.module.scss";
import { formatToHoursAndMinutes, getListOfTimePoints } from "../utils";

import FontIcon from "applications/slimmobile/common/components/FontIcon";
import { useOnClickOutside } from "hooks/utils-hooks";
import { DAY_MSEC, getHourTimestamp } from "utils/date";

const isToday = require("dayjs/plugin/isToday");

dayjs.extend(isToday);

const defaultProps = {};

const propTypes = {
  date: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

const TimePicker = ({ date, onChange, value }) => {
  const [isActive, setIsActive] = useState(false);

  const menuRef = useRef();
  useOnClickOutside(menuRef, () => setIsActive(false));

  const listOfTimePoints = getListOfTimePoints({
    timestampMax: date.isToday() ? getHourTimestamp(getDatejsHour(dayjs())) + 1 : DAY_MSEC,
    timestampMin: 0,
    timestampSelected: value,
  }).map((option) => ({
    key: option,
    label: formatToHoursAndMinutes(option),
    value: option,
  }));

  const itemSelected = listOfTimePoints.find((item) => item.value === value);

  if (!itemSelected) {
    return null;
  }

  return (
    <div
      className={classes["time-picker-wrapper"]}
      ref={menuRef}
      role="button"
      tabIndex={0}
      onClick={() => setIsActive(!isActive)}
    >
      <span className={classes["time-picker-icon"]}>
        <FontIcon icon={faClock} />
      </span>
      <span className={classes["time-picker-value"]}>{itemSelected.label}</span>
      {isActive && (
        <div className={classes["time-picker-items"]}>
          {listOfTimePoints.map((item) => (
            <div
              className={`${classes["time-picker-item"]} ${item.value === value ? classes["active"] : "none"}`}
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setIsActive(false);
              }}
            >
              <span className={classes["time-picker-icon"]}>
                <FontIcon icon={faClock} />
              </span>
              <span className={classes["time-picker-value"]}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;

export default TimePicker;
