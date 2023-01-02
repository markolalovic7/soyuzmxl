import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";
import AsianMarketOutcomePrice from "../AsianMarketOutcomePrice";

const AsianMarketML = ({ centered, eventId, outcomes }) => (
  <td>
    <div
      className={cx(classes["asian-sports-table__numbers"], {
        [classes["asian-sports-table__numbers_center"]]: centered,
      })}
    >
      {outcomes.map((outcome) => (
        <AsianMarketOutcomePrice
          eventId={eventId}
          hidden={outcome.hidden}
          key={outcome.outcomeId}
          outcomeId={outcome.outcomeId}
          price={outcome.price}
          priceDir={outcome.priceDir}
        />
      ))}
    </div>
  </td>
);

const propTypes = {
  centered: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  outcomes: PropTypes.array.isRequired,
};

AsianMarketML.propTypes = propTypes;
export default React.memo(AsianMarketML);
