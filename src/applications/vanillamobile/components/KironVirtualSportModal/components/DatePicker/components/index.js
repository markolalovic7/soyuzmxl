import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { useSelector } from "react-redux";

import "../styles/date-picker.css";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../../../../utils/day-picker-utils";
import classes from "../styles/index.module.scss";
import { getModifiersStyles } from "../utils";

import FontIcon from "applications/slimmobile/common/components/FontIcon";
import { useOnClickOutside } from "hooks/utils-hooks";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getDatejsObject, parseDateFromDayjsObject } from "utils/dayjs";
import { formatDateDayMonthYear } from "utils/dayjs-format";

import dayjs from "dayjs";

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};
const defaultProps = {};

const isCalendarValidDate = (current) => {
  const xx = dayjs();
  const tomorrow = dayjs().add(1, "day").hour(0).minute(0).second(0);

  return dayjs(current).isAfter(tomorrow);
};

const DatePicker = ({ onChange, value }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsDatePickerOpen(false));
  const language = useSelector(getAuthLanguage);

  const onDateChange = (date) => {
    onChange(getDatejsObject(date));
    setIsDatePickerOpen(false);
  };

  return (
    <div className={classes["date-picker-wrapper"]}>
      <div className={classes["date-picker-content"]} onClick={() => setIsDatePickerOpen((isOpen) => !isOpen)}>
        <span className={classes["date-picker-icon"]}>
          <FontIcon icon={faCalendarAlt} />
        </span>
        <span className={classes["date-picker-value"]}>{formatDateDayMonthYear(value)}</span>
      </div>
      {isDatePickerOpen && (
        <div className={classes["date-picker-picker"]} ref={ref}>
          <DayPicker
            disabledDays={isCalendarValidDate}
            firstDayOfWeek={1}
            locale={language}
            modifiersStyles={getModifiersStyles()}
            months={getMonths(language)}
            valueDays={parseDateFromDayjsObject(value)}
            weekdaysLong={getWeekdaysLong(language)}
            weekdaysShort={getWeekdaysShort(language)}
            onDayClick={onDateChange}
          />
        </div>
      )}
    </div>
  );
};

DatePicker.defaultProps = defaultProps;
DatePicker.propTypes = propTypes;

export default DatePicker;
