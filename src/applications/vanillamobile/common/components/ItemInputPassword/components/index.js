import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import { useState } from "react";

import FontIcon from "../../FontIcon";
import ItemInput from "../../ItemInput";
import classes from "../styles/index.module.scss";

const propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
const defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  value: "",
};

const ItemInputPassword = ({ onBlur, onChange, value, ...props }) => {
  const [showHidePassword, changeShowHidePassword] = useState(false);

  const onIconChange = () => {
    changeShowHidePassword(!showHidePassword);
  };

  return (
    <ItemInput
      {...props}
      renderIcon={() => (
        <span className={classes["item-input-password-icon"]} onClick={onIconChange}>
          <FontIcon icon={showHidePassword ? faEyeSlash : faEye} />
        </span>
      )}
      type={showHidePassword ? "text" : "password"}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

ItemInputPassword.propTypes = propTypes;
ItemInputPassword.defaultProps = defaultProps;

export default ItemInputPassword;
