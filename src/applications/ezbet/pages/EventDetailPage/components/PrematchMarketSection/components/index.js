import PropTypes from "prop-types";
import React from "react";

import MarketBlock from "../../../../../components/MarketBlock";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const PrematchMarketSection = ({ eventId, feedcode, groupedMarkets, sportCode }) => (
  <section className={classes["market-types"]}>
    <div className={classes["accordion-wrapper"]}>
      {groupedMarkets.map((marketGroup, index) => (
        <MarketBlock
          eventId={eventId}
          feedcode={feedcode}
          key={index}
          marketGroup={marketGroup}
          sportCode={sportCode}
        />
      ))}
    </div>
  </section>
);

PrematchMarketSection.propTypes = {
  eventId: PropTypes.number.isRequired,
  feedcode: PropTypes.string.isRequired,
  groupedMarkets: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
};

export default React.memo(PrematchMarketSection);
