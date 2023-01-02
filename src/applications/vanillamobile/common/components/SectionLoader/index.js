import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import PropTypes from "prop-types";

const SectionLoader = ({ overlay = false }) => (
  <div className={cx(classes["section-loader"], { [classes["section-loader__overlay"]]: overlay })}>
    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
  </div>
);

SectionLoader.propTypes = { overlay: PropTypes.bool };
SectionLoader.defaultProps = { overlay: false };

export default SectionLoader;
