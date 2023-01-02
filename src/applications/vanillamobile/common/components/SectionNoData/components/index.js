import PropTypes from "prop-types";

import classes from "../styles/index.module.scss";

const propTypes = {
  title: PropTypes.string,
};
const defaultProps = {
  title: undefined,
};

const SectionNoData = ({ title }) =>
  title ? (
    <div className={classes["section-no-data-container"]}>
      <div className={classes["section-no-data-label"]}>{title}</div>
    </div>
  ) : null;

SectionNoData.propTypes = propTypes;
SectionNoData.defaultProps = defaultProps;

export default SectionNoData;
