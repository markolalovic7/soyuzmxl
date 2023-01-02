import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const optionType = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSetFieldValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape(optionType)).isRequired,
  required: PropTypes.bool,
};

const defaultProps = {
  required: false,
};

const SelectField = ({ label, name, onSetFieldValue, options, ...restProps }) => {
  const onChangePressed = (event) => {
    if (onSetFieldValue) {
      onSetFieldValue(name, event.target.value);
    }
  };

  return (
    <div className={classes["form__item"]}>
      <div className={classes["form__label"]}>
        <span>{label}</span>
        {restProps.required && <span className={classes["registration__star"]}>*</span>}
      </div>
      <div className={classes["form__select"]}>
        <select {...restProps} onChange={onChangePressed}>
          {options.map(({ label, value }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className={classes["form__select-arrow"]}>
          <span />
        </span>
      </div>
    </div>
  );
};

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;

export default SelectField;
