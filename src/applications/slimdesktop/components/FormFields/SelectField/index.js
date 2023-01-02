import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
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
    <div className={cx(classes["input"], classes["select"])}>
      <span className={classes["select__title"]}>
        {label} {restProps.required && <i>*</i>}
      </span>
      <div className={classes["input__content"]}>
        <select {...restProps} onChange={onChangePressed}>
          {options.map(({ label, value }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className={classes["select__arrow"]}>
          <span />
        </span>
      </div>
    </div>
  );
};

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;

export default SelectField;
