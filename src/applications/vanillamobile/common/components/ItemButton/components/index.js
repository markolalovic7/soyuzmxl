import PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

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
    className={classes["form__button"]}
    disabled={isDisabled}
    style={{ opacity: isDisabled ? 0.5 : 1 }}
    type="submit"
    {...props}
  >
    {label}
  </button>
);

ItemButton.propTypes = propTypes;
ItemButton.defaultProps = defaultProps;

export default ItemButton;
