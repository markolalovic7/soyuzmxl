import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../scss/citywebstyle.module.scss";
import complexCouponSportCodes from "../../utils/complexCouponSportCodes";

import ComplexOutcomePriceContentHolder from "./ComplexOutcomePriceContentHolder";
import MatchActionIconContentHolder from "./MatchActionIconContentHolder";
import MatchEventDetailsContentHolder from "./MatchEventDetailsContentHolder";
import StandardOutcomePriceContentHolder from "./StandardOutcomePriceContentHolder";

const MatchSummaryContentHolder = ({ favouriteEnabled, leagueAndCountryDesc, match, overviewPageMode, sportCode }) => {
  const standardDisplayMode = overviewPageMode || !complexCouponSportCodes.includes(sportCode);

  return (
    <div
      className={`${classes["sports-spoiler__content"]} ${classes["sports-spoiler__content_uncoming"]}`}
      key={match.eventId}
    >
      <MatchEventDetailsContentHolder
        a={match.a}
        aScore={match.aScore}
        b={match.b}
        brMatchId={match.brMatchId}
        cMin={match.cMin}
        cPeriod={match.cPeriod}
        cStatus={match.cStatus}
        cType={match.cType}
        epoch={match.epoch}
        eventId={match.eventId}
        hScore={match.hScore}
        hasRapidMarket={match.hasRapidMarket}
        leagueAndCountryDesc={leagueAndCountryDesc}
        live={match.live}
        periodScores={match.periodScores}
        sportCode={sportCode}
      />

      {standardDisplayMode ? (
        <StandardOutcomePriceContentHolder eventId={match.eventId} markets={match.markets} />
      ) : (
        <ComplexOutcomePriceContentHolder eventId={match.eventId} markets={match.markets} />
      )}

      <MatchActionIconContentHolder
        count={match.count}
        displayedMarketCount={match.markets.length}
        eventId={match.eventId}
        favouriteEnabled={favouriteEnabled}
        live={match.live}
      />
    </div>
  );
};

const propTypes = {
  favouriteEnabled: PropTypes.bool,
  match: PropTypes.object.isRequired,
  overviewPageMode: PropTypes.bool,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  favouriteEnabled: undefined,
  overviewPageMode: undefined,
};

MatchSummaryContentHolder.propTypes = propTypes;
MatchSummaryContentHolder.defaultProps = defaultProps;

export default React.memo(MatchSummaryContentHolder);
