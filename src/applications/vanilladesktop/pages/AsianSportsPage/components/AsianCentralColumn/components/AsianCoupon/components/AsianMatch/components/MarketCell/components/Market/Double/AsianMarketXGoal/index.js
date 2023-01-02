import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";
import AsianMarketOutcomePrice from "../AsianMarketOutcomePrice";

const AsianMarketXGoal = ({ centered, eventId, outcomes }) => (
  <td>
    <div
      className={cx(classes["asian-sports-table__numbers"], {
        [classes["asian-sports-table__numbers_center"]]: centered,
      })}
    >
      {outcomes.length === 3 && (
        <>
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcomes[0].hidden}
            key={outcomes[0].outcomeId}
            outcomeId={outcomes[0].outcomeId}
            price={outcomes[0].price}
            priceDir={outcomes[0].priceDir}
          />
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcomes[2].hidden}
            key={outcomes[2].outcomeId}
            outcomeId={outcomes[2].outcomeId}
            price={outcomes[2].price}
            priceDir={outcomes[2].priceDir}
          />
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcomes[1].hidden}
            key={outcomes[1].outcomeId}
            outcomeId={outcomes[1].outcomeId}
            price={outcomes[1].price}
            priceDir={outcomes[1].priceDir}
          />
        </>
      )}
    </div>
  </td>
);

const propTypes = {
  centered: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  outcomes: PropTypes.array.isRequired,
};

AsianMarketXGoal.propTypes = propTypes;

export default React.memo(AsianMarketXGoal);
