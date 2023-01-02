import PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  label: PropTypes.string,
};
const defaultProps = {
  label: undefined,
};

const SectionHeader = ({ label }) => label && <h3 className={classes["form__label"]}>{label}</h3>;

SectionHeader.propTypes = propTypes;
SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
