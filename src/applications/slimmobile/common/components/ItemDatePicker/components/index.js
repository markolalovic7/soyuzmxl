import PropTypes from "prop-types";

import TextDefaultRed from "../../TextDefaultRed";
import classes from "../styles/index.module.scss";

const propTypes = {
  date: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  textError: PropTypes.string,
};
const defaultProps = {
  isDisabled: false,
  isRequired: false,
  label: "",
  maxDate: undefined,
  minDate: undefined,
  onBlur: () => {},
  onChange: () => {},
  textError: "",
};

// Note: Returned value has month in range of [1, 12], but dayjs operated with [0, 11] values only.
const ItemDatePicker = ({
  date,
  isDisabled,
  isRequired,
  label,
  maxDate,
  minDate,
  name,
  onBlur,
  onChange,
  textError,
  ...props
}) => {
  const onDateChange = (event) => {
    if (!onChange) {
      return;
    }
    const { value } = event.target;
    // // A `value` maybe be empty when date is invalid (e.g. the 32nd of April).
    if (!value) {
      return;
    }
    onChange(name, value);
  };

  return (
    <div className={classes["item-date-picker-wrapper"]}>
      <h4 className={classes["textarea__title"]}>
        <span>{`${label} `}</span>
        {isRequired && <span className={classes["textarea__star"]}>*</span>}
      </h4>
      <div className={classes["item-date-picker-picker-wrapper"]}>
        <input
          className={classes["item-date-picker-input"]}
          disabled={isDisabled}
          max={maxDate}
          min={minDate}
          required={isRequired}
          type="date"
          value={date}
          onBlur={onBlur}
          onChange={onDateChange}
          {...props}
        />
      </div>
      {textError && <TextDefaultRed text={textError} />}
    </div>
  );
};

ItemDatePicker.propTypes = propTypes;
ItemDatePicker.defaultProps = defaultProps;

export default ItemDatePicker;
