import PropTypes from "prop-types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../../utils/day-picker-utils";

const propTypes = {
  date: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
};

const defaultProps = {
  required: false,
  type: "text",
};

const DATE_FORMAT = "DD-MMM-YY";

const DatePickerField = ({ date, label, name, onChange, textError, type, ...inputProps }) => {
  const { t } = useTranslation();
  const language = useSelector(getAuthLanguage);

  const formatDate = (date) => dayjs(date).format(DATE_FORMAT);

  const parseDate = (str) => {
    const parsed = dayjs(str, DATE_FORMAT, language);
    if (!parsed.isValid()) {
      return new Date();
    }

    return parsed.toDate();
  };

  return (
    <div className={classes["input"]}>
      <label htmlFor={inputProps.name}>
        {label} {inputProps.required && <i>*</i>}
      </label>
      <div className={classes["input__content"]}>
        <DayPickerInput
          dayPickerProps={{
            disabledDays: {
              after: dayjs(new Date()).subtract(18, "year").toDate(),
            },
            firstDayOfWeek: 1,
            months: getMonths(language),
            weekdaysLong: getWeekdaysLong(language),
            weekdaysShort: getWeekdaysShort(language),
          }}
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder={t("forms.birth_date")}
          style={{ display: "block" }}
          value={formatDate(date)}
          onDayChange={(day) => onChange(name, day)}
        />
      </div>
      {textError && <span className={classes["input__error-message"]}>{textError}</span>}
    </div>
  );
};

DatePickerField.propTypes = propTypes;
DatePickerField.defaultProps = defaultProps;

export default DatePickerField;
