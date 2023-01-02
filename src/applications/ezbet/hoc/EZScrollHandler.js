import PropTypes from "prop-types";
import { isWindows } from "react-device-detect";
import SimpleBar from "simplebar-react";

const EZScrollHandler = ({ children }) => {
  if (isWindows) {
    return <SimpleBar none>{children}</SimpleBar>;
  }

  return children;
};
const propTypes = {
  children: PropTypes.any.isRequired,
};

EZScrollHandler.propTypes = propTypes;

export default EZScrollHandler;
