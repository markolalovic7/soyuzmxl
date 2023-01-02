import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChecked: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

const defaultProps = {
  required: false,
};

const CheckboxField = ({ checked, id, label, onChecked, ...inputProps }) => (
  <div className={classes["registration__checkbox"]}>
    <input {...inputProps} checked={checked} id={id} type="checkbox" onChange={(e) => onChecked(e.target.checked)} />
    <label htmlFor={id}>
      <FontAwesomeIcon icon={faCheck} />
    </label>
    <span>{label}</span>
  </div>
);

CheckboxField.propTypes = propTypes;
CheckboxField.defaultProps = defaultProps;

export default CheckboxField;
