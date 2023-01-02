import PropTypes from "prop-types";
import React from "react";

import AdditionalMarketContainer from "./AdditionalMarketContainer/AdditionalMarketContainer";
import PrematchMatchDefaultMarkets from "./PrematchMatchDefaultMarkets/PrematchMatchDefaultMarkets";
import PrematchMatchHeader from "./PrematchMatchHeader/PrematchMatchHeader";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  additionalMarketsExpanded: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  live: PropTypes.bool.isRequired,
  onToggleActiveEvent: PropTypes.func.isRequired,
  virtual: PropTypes.bool.isRequired,
};

const defaultProps = {};

const MatchContainer = ({ additionalMarketsExpanded, event, live, onToggleActiveEvent, virtual }) => {
  const displayedMarketIds = event.children ? Object.values(event.children).map((market) => market.id) : [];

  return (
    <div className={classes["bet"]}>
      <div className={classes["bet__container"]}>
        <PrematchMatchHeader
          additionalMarketsExpanded={additionalMarketsExpanded}
          event={event}
          onToggleActiveEvent={onToggleActiveEvent}
        />
        <PrematchMatchDefaultMarkets eventId={event.id} markets={event.children ? Object.values(event.children) : []} />
      </div>

      <div className={`${classes["matches"]} ${additionalMarketsExpanded ? classes["active"] : ""}`}>
        {additionalMarketsExpanded ? (
          <AdditionalMarketContainer
            eventId={event.id}
            excludedMarketIds={displayedMarketIds}
            live={live}
            virtual={virtual}
          />
        ) : null}
      </div>
    </div>
  );
};

MatchContainer.propTypes = propTypes;
MatchContainer.defaultProps = defaultProps;

export default React.memo(MatchContainer);
