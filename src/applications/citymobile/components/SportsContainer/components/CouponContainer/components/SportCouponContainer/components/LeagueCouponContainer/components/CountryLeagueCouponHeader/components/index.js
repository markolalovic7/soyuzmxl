import * as PropTypes from "prop-types";
import React from "react";
import ReactCountryFlag from "react-country-flag";

import { ReactComponent as FallbackWorldImage } from "../../../../../../../../../../../../../assets/img/icons/World_Flag.svg";
import classes from "../../../../../../../../../../../scss/citymobile.module.scss";

const sanitiseCountryCode = (code) => {
  if (true) {
    return code;
  }

  return "XX";
};

const CountryLeagueCouponHeader = ({
  categoryDescription,
  countryCode,
  eventCount,
  onToggleSection,
  tournamentDescription,
}) => (
  <div
    className={`${classes["sports-spoiler__item"]} ${classes["accordion"]} ${classes["active"]}`}
    onClick={onToggleSection}
  >
    {/* <span */}
    {/*    className={classes["sports-spoiler__item-icon"]} */}
    {/* > */}
    {countryCode ? (
      <ReactCountryFlag
        svg
        className={classes["sports-spoiler__item-icon"]}
        countryCode={sanitiseCountryCode(countryCode)}
      />
    ) : (
      <FallbackWorldImage className={classes["sports-spoiler__item-icon"]} style={{ height: "1em", width: "1em" }} />
    )}
    {/* </span> */}
    <span className={classes["sports-spoiler__item-text"]}>
      {`${categoryDescription} - ${tournamentDescription} (${eventCount})`}
    </span>
  </div>
);

const propTypes = {
  categoryDescription: PropTypes.string.isRequired,
  countryCode: PropTypes.string,
  eventCount: PropTypes.number.isRequired,
  onToggleSection: PropTypes.func.isRequired,
  tournamentDescription: PropTypes.string.isRequired,
};

const defaultProps = { countryCode: undefined };

CountryLeagueCouponHeader.propTypes = propTypes;
CountryLeagueCouponHeader.defaultProps = defaultProps;

export default React.memo(CountryLeagueCouponHeader);
