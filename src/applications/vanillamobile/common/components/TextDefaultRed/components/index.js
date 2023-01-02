import PropTypes from "prop-types";

import classes from "../styles/index.module.scss";

const propTypes = {
  text: PropTypes.string,
};
const defaultProps = {
  text: undefined,
};

const TextDefaultError = ({ text }) =>
  text && (
    <div className={classes["text-default-error-wrapper"]}>
      <div className={classes["text-default-error"]}>{text}</div>
    </div>
  );

TextDefaultError.propTypes = propTypes;
TextDefaultError.defaultProps = defaultProps;

export default TextDefaultError;
