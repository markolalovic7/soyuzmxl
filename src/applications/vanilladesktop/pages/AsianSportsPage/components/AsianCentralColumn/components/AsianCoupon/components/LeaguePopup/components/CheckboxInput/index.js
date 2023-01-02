import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CheckboxInput = ({ checked, id, label, name, onChange }) => (
  <div className={classes["popup-league__checkbox"]} style={{ cursor: "pointer" }} onClick={onChange}>
    <input
      checked={checked}
      className={classes["popup-league__input"]}
      id={id}
      name={name}
      type="checkbox"
      onClick={(e) => e.preventDefault()}
    />
    <label htmlFor={id} onClick={(e) => e.preventDefault()}>
      <FontAwesomeIcon icon={faCheck} />
    </label>
    <span>{label}</span>
  </div>
);

CheckboxInput.propTypes = propTypes;

export default CheckboxInput;
