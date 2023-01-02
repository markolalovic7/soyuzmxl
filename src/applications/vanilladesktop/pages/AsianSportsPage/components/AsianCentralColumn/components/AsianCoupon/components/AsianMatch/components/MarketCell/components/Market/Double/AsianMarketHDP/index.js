import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";
import AsianMarketOutcomePrice from "../AsianMarketOutcomePrice";

const formatSpreads = (spread, spread2) => {
  if (spread) {
    if (spread2) {
      if (Math.abs(spread) < Math.abs(spread2)) {
        return `${spread},${spread2}`;
      }

      return `${spread2},${spread}`;
    }

    return spread;
  }

  return "";
};

const AsianMarketHDP = ({ centered, eventId, outcomes }) => (
  <td>
    <div
      className={cx(classes["asian-sports-table__numbers"], {
        [classes["asian-sports-table__numbers_center"]]: centered,
      })}
    >
      {outcomes.map((outcome, index) => {
        const spread = outcome.spread === 0 ? "0" : outcome.spread?.toLocaleString();
        const spread2 = outcome.spread2 === 0 ? "0" : outcome.spread2?.toLocaleString();

        return (
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcome.hidden}
            key={outcome.outcomeId}
            label={index ? formatSpreads(spread, spread2) : ""}
            outcomeId={outcome.outcomeId}
            price={outcome.price}
            priceDir={outcome.priceDir}
          />
        );
      })}
    </div>
  </td>
);

const propTypes = {
  centered: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  outcomes: PropTypes.array.isRequired,
};

AsianMarketHDP.propTypes = propTypes;

export default React.memo(AsianMarketHDP);
