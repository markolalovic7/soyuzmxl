import { mapPeriods } from "applications/slimmobile/components/ResultsPage/utils";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import MatchOutcomeResult from "../../MatchOutcomeResult";

const propTypes = {
  expandedDetails: PropTypes.array.isRequired,
};
const defaultProps = {};

const MatchExpandedInfo = ({ expandedDetails }) => {
  const periods = mapPeriods(expandedDetails);

  return periods.map((period, description) => (
    <div className={cx(classes["flag"], { [classes["flag_3-columns"]]: period?.players?.length === 3 })}>
      <MatchOutcomeResult key={`${period.id}${description}`} period={period} />
    </div>
  ));
};

MatchExpandedInfo.propTypes = propTypes;
MatchExpandedInfo.defaultProps = defaultProps;

export default React.memo(MatchExpandedInfo);
