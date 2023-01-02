import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const propTypes = {
  icon: PropTypes.object.isRequired,
};
const defaultProps = {};

const FontIcon = ({ icon, ...props }) => <FontAwesomeIcon icon={icon} {...props} />;

FontIcon.propTypes = propTypes;
FontIcon.defaultProps = defaultProps;

export default FontIcon;
