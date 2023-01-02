import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../scss/citymobile.module.scss";

const CountryLeagueCouponHeader = ({ categoryDescription, eventCount, tournamentDescription }) => (
  <div className={`${classes["sports-title"]}`}>
    {categoryDescription} -{tournamentDescription} ({eventCount})
  </div>
);

const propTypes = {
  categoryDescription: PropTypes.string.isRequired,
  eventCount: PropTypes.number.isRequired,
  tournamentDescription: PropTypes.string.isRequired,
};

const defaultProps = {};

CountryLeagueCouponHeader.propTypes = propTypes;
CountryLeagueCouponHeader.defaultProps = defaultProps;

export default React.memo(CountryLeagueCouponHeader);
