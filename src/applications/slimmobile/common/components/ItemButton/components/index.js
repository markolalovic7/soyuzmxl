import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
};
const defaultProps = {
  isDisabled: false,
  label: "",
};

const ItemButton = ({ isDisabled, label, ...props }) => (
  <button
    className={classes["box__button"]}
    disabled={isDisabled}
    style={{ opacity: isDisabled ? 0.5 : 1 }}
    type="submit"
    {...props}
  >
    <div>{label}</div>
  </button>
);

ItemButton.propTypes = propTypes;
ItemButton.defaultProps = defaultProps;

export default ItemButton;
