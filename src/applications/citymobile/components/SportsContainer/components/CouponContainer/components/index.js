import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../scss/citymobile.module.scss";

import SportCouponContainer from "./SportCouponContainer";

const CouponContainer = ({
  combinedContent,
  groupModePreference,
  maxMatchesPerLeague,
  modeSwitchAllowed,
  onPreferenceModeSwitch,
  sportCode,
}) => (
  <div className={classes["spoilers-tabs"]}>
    <SportCouponContainer
      combinedContent={combinedContent}
      groupModePreference={groupModePreference}
      maxMatchesPerLeague={maxMatchesPerLeague}
      modeSwitchAllowed={modeSwitchAllowed}
      sportCode={sportCode}
      onPreferenceModeSwitch={onPreferenceModeSwitch}
    />
  </div>
);

const propTypes = {
  combinedContent: PropTypes.array.isRequired,
  modeSwitchAllowed: PropTypes.bool.isRequired,
  onPreferenceModeSwitch: PropTypes.func.isRequired,
  sportCode: PropTypes.string,
};

const defaultProps = {
  sportCode: undefined,
};

CouponContainer.propTypes = propTypes;
CouponContainer.defaultProps = defaultProps;

export default React.memo(CouponContainer);
