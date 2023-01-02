import PropTypes from "prop-types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
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

const DatePickerField = ({ date, label, name, onChange, type, ...inputProps }) => {
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
    <div className={classes["form__item"]}>
      <div className={classes["form__label"]}>
        <span>{label}</span>
        {inputProps.required && <span className={classes["registration__star"]}>*</span>}
      </div>
      <div className={classes["form__input"]}>
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
    </div>
  );
};

DatePickerField.propTypes = propTypes;
DatePickerField.defaultProps = defaultProps;

export default DatePickerField;
