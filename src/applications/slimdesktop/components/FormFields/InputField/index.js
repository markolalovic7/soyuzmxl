import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

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

const InputField = ({ label, textError, type, ...inputProps }) => (
  <div className={cx(classes["input"], { [classes["data-error"]]: textError })}>
    <label htmlFor={inputProps.name}>
      {label}
      {inputProps.required && <i>*</i>}
    </label>
    <div className={classes["input__content"]}>
      <input type={type} {...inputProps} />
      {textError && (
        <div className={classes["input__error"]}>
          <FontAwesomeIcon icon={faExclamationCircle} />
        </div>
      )}
    </div>
    {textError && <span className={classes["input__error-message"]}>{textError}</span>}
  </div>
);

InputField.propTypes = propTypes;
InputField.defaultProps = defaultProps;

export default InputField;
