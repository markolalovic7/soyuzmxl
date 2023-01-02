import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";

import TextDefaultRed from "../../TextDefaultRed";

const propTypes = {
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  renderIcon: PropTypes.func,
  textError: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};
const defaultProps = {
  isDisabled: false,
  isRequired: false,
  label: "",
  onBlur: () => {},
  onChange: () => {},
  placeholder: "",
  renderIcon: undefined,
  textError: "",
  type: "text",
  value: "",
};

const ItemInput = ({
  isDisabled,
  isRequired,
  label,
  onBlur,
  onChange,
  placeholder,
  renderIcon,
  textError,
  type,
  value,
  ...props
}) => (
  <div className={isDisabled ? classes["textarea"] : `${classes["textarea"]} ${classes["textarea_editable"]}`}>
    <h4 className={classes["textarea__title"]}>
      <span>{`${label} `}</span>
      {isRequired && <span className={classes["textarea__star"]}>*</span>}
    </h4>
    <input
      {...props}
      disabled={isDisabled}
      placeholder={placeholder}
      type={type}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    />
    {renderIcon ? renderIcon() : null}
    {textError && <TextDefaultRed text={textError} />}
  </div>
);

ItemInput.propTypes = propTypes;
ItemInput.defaultProps = defaultProps;

export default ItemInput;
