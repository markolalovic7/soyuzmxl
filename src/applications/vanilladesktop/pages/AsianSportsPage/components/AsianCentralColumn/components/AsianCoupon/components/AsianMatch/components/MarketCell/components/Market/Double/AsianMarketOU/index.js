import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";
import AsianMarketOutcomePrice from "../AsianMarketOutcomePrice";

const AsianMarketOU = ({ centered, eventId, outcomes }) => (
  <td>
    <div
      className={cx(classes["asian-sports-table__numbers"], {
        [classes["asian-sports-table__numbers_center"]]: centered,
      })}
    >
      {outcomes.map((outcome, index) => {
        const spread = outcome.spread?.toLocaleString();
        const spread2 = outcome.spread2?.toLocaleString();

        return (
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcome.hidden}
            key={outcome.outcomeId}
            label={index ? "U" : spread2 ? `${spread},${spread2}` : spread}
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
AsianMarketOU.propTypes = propTypes;

export default React.memo(AsianMarketOU);
