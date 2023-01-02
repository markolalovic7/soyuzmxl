import * as PropTypes from "prop-types";
import React from "react";

import complexCouponSportCodes from "../../../../../../../../../../../../citydesktop/components/Common/utils/complexCouponSportCodes";
import classes from "../../../../../../../../../../../scss/citymobile.module.scss";

import ComplexCouponMatchInformation from "./ComplexCouponMatchInformation";
import ComplexMarketHeader from "./ComplexMarketHeader";
import ComplexMarketsContainer from "./ComplexMarketsContainer";
import CouponMatchInformation from "./CouponMatchInformation";
import CouponOutcomePrice from "./CouponOutcomePrice";

const MatchCouponContainer = ({ groupModePreference, match, sportCode, strictLive }) => {
  const isComplexSport = complexCouponSportCodes.includes(sportCode);

  return (
    <div className={classes["sports-spoiler__content"]}>
      {isComplexSport && !strictLive ? (
        <>
          <ComplexMarketHeader />

          <ComplexMarketsContainer match={match} sportCode={sportCode} />

          <ComplexCouponMatchInformation match={match} sportCode={sportCode} />
        </>
      ) : (
        <>
          <CouponMatchInformation groupModePreference={groupModePreference} match={match} sportCode={sportCode} />

          <div className={classes["sports-spoiler__coeficients"]}>
            {match.markets &&
              match.markets.length > 0 &&
              match.markets[0].outcomes.map((selection) => (
                <CouponOutcomePrice eventId={match.eventId} key={selection.outcomeId} selection={selection} />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

const propTypes = {
  match: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
  strictLive: PropTypes.bool.isRequired,
};

const defaultProps = {};

MatchCouponContainer.propTypes = propTypes;
MatchCouponContainer.defaultProps = defaultProps;

export default React.memo(MatchCouponContainer);
