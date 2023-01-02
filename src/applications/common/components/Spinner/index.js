import PropTypes from "prop-types";

const propTypes = {
  className: PropTypes.string.isRequired,
};
const defaultProps = {};

// https://projects.lukehaas.me/css-loaders/
const Spinner = ({ className }) => <div className={className} />;

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner;
