import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SectionLoader = () => (
  <div className={classes["spinner-container"]}>
    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
  </div>
);

export default SectionLoader;
