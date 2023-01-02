import * as PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import SettingsVG from "../../../../../../../../../img/icons/settings.svg";
import classes from "../../../../../../../../../scss/citymobile.module.scss";

const SportCouponHeader = ({ eventCount, modeSwitchAllowed, onPreferenceModeSwitch, sportCode }) => {
  const sports = useSelector((state) => state.sport.sports);

  return (
    <h3
      className={`${classes["sports-title"]} ${modeSwitchAllowed ? classes["sports-title_special"] : ""} ${
        classes["sports-title_arrow"]
      }`}
    >
      {`${sports && sportCode ? sports[sportCode].description : sportCode} (${eventCount})`}

      {modeSwitchAllowed ? (
        <span className={classes["sports-title__settings"]} onClick={onPreferenceModeSwitch}>
          <img alt="settings" src={SettingsVG} />
        </span>
      ) : null}
    </h3>
  );
};

const propTypes = {
  eventCount: PropTypes.number.isRequired,
  modeSwitchAllowed: PropTypes.bool.isRequired,
  onPreferenceModeSwitch: PropTypes.func.isRequired,
  sportCode: PropTypes.string,
};

const defaultProps = {
  sportCode: undefined,
};

SportCouponHeader.propTypes = propTypes;
SportCouponHeader.defaultProps = defaultProps;

export default React.memo(SportCouponHeader);
