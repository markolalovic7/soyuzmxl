import cx from "classnames";

import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";
import AsianMarketOutcomePrice from "../../Double/AsianMarketOutcomePrice";

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

const GenericSingleAsianMarket = ({ eventId, hasSpread, market, selectionCount }) => {
  if (!market) {
    // placeholder
    return Array.from(Array(selectionCount)).map((outcome, index) => (
      <td key={index}>
        <div className={classes["asian-sports-table__numbers"]} />
      </td>
    ));
  }

  return [
    // Strong assumption that the outcome in the asianViewSportMarkets has spread coming first...
    hasSpread ? (
      <td key={`${market.marketId}-spread`}>
        <div className={classes["asian-sports-table__numbers"]}>
          <div className={classes["asian-sports-table__coeficients"]}>
            <div
              className={cx(
                classes["asian-sports-table__coeficient"],
                classes["asian-sports-table__coeficient_highlighted"],
              )}
            >
              <span>
                {formatSpreads(
                  market.outcomes[market.outcomes.length - 1].spread === 0
                    ? "0"
                    : market.outcomes[market.outcomes.length - 1].spread?.toLocaleString(),
                  market.outcomes[market.outcomes.length - 1].spread2 === 0
                    ? "0"
                    : market.outcomes[market.outcomes.length - 1].spread2?.toLocaleString(),
                )}
              </span>
            </div>
          </div>
        </div>
      </td>
    ) : null,
    market.outcomes.map((outcome) => (
      <td key={outcome.outcomeId}>
        <div className={classes["asian-sports-table__numbers"]}>
          <AsianMarketOutcomePrice
            eventId={eventId}
            hidden={outcome.hidden}
            key={outcome.outcomeId}
            outcomeId={outcome.outcomeId}
            price={outcome.price}
            priceDir={outcome.priceDir}
          />
        </div>
      </td>
    )),
  ];
};

export default GenericSingleAsianMarket;
