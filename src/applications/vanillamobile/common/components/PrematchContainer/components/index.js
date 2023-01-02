import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import {
  APPLICATION_TYPE_MOBILE_ASIAN,
  APPLICATION_TYPE_MOBILE_VANILLA,
} from "../../../../../../constants/application-types";
import { getAuthMobileView } from "../../../../../../redux/reselect/auth-selector";
import AsianPrematchContainer from "../../AsianPrematchContainer";
import EuropeanPrematchContainer from "../../EuropeanPrematchContainer";

const propTypes = {
  eventType: PropTypes.string.isRequired,
  filterEventId: PropTypes.number,
  live: PropTypes.bool,
  max: PropTypes.number,
  searchCode: PropTypes.string.isRequired,
  sportCode: PropTypes.string,
  virtual: PropTypes.bool,
};

const defaultProps = {
  filterEventId: undefined,
  live: false,
  max: undefined,
  sportCode: undefined,
  virtual: false,
};

// TODO: Refactor in future.
const PrematchContainer = ({ eventType, filterEventId, live, max, searchCode, sportCode, virtual }) => {
  const view = useSelector(getAuthMobileView);

  if (view === APPLICATION_TYPE_MOBILE_VANILLA || eventType === "RANK" || virtual) {
    return (
      <EuropeanPrematchContainer
        eventType={eventType}
        filterEventId={filterEventId}
        live={live}
        max={max}
        searchCode={searchCode}
        virtual={virtual}
      />
    );
  }

  if (view === APPLICATION_TYPE_MOBILE_ASIAN) {
    return (
      <AsianPrematchContainer
        eventType={eventType}
        filterEventId={filterEventId}
        max={max}
        searchCode={searchCode}
        sportCode={sportCode}
      />
    );
  }

  return null;
};

PrematchContainer.propTypes = propTypes;
PrematchContainer.defaultProps = defaultProps;

export default React.memo(PrematchContainer);
