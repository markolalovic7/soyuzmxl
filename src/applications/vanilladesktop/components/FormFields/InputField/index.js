import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useState } from "react";

const propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  textError: PropTypes.string,
  type: PropTypes.string,
};

const defaultProps = {
  required: false,
  textError: undefined,
  type: "text",
};

const InputField = ({ label, textError, type, ...inputProps }) => {
  const [isVisible, setIsVisible] = useState(false);
  const currentInputType = type === "password" && isVisible ? "text" : type;

  const togglePasswordVisibility = () => {
    setIsVisible((isVisible) => !isVisible);
  };

  return (
    <div className={classes["form__item"]}>
      <div className={classes["form__label"]}>
        <span>{label}</span>
        {inputProps.required && <span className={classes["registration__star"]}>*</span>}
      </div>
      <div className={classes["form__input"]}>
        <input type={currentInputType} {...inputProps} />
        {type === "password" && <i className={classes["qicon-visibility"]} onClick={togglePasswordVisibility} />}
      </div>
      {textError && <div style={{ color: "red" }}>{textError}</div>}
    </div>
  );
};

InputField.propTypes = propTypes;
InputField.defaultProps = defaultProps;

export default InputField;
