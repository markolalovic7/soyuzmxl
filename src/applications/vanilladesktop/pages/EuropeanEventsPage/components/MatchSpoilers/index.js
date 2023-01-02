import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

import MatchExpansionPanel from "../MatchExpansionPanel";

const getRows = (children) => {
  const arrays = [];
  if (children) {
    const size = children.length > 3 ? 2 : children.length; // if size is 2-3, display as is. If the size is > 3, split in groups of 2

    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const MatchSpoilers = ({ markets, matchId }) => (
  <div className={classes["match-spoilers"]}>
    {markets.map((marketGroup) => {
      const rows = [];

      marketGroup.forEach((market) => {
        const marketRows = market.children ? getRows(Object.values(market.children)) : []; // split in 2-3 outcomes per row (for as many rows as required...)
        rows.push(...marketRows);
      });

      return (
        <MatchExpansionPanel
          coefficientRows={rows}
          key={marketGroup[0].id}
          label={`${marketGroup[0].desc} - ${marketGroup[0].period}`}
          marketId={marketGroup[0].id}
          matchId={matchId}
        />
      );
    })}
  </div>
);

const propTypes = {
  markets: PropTypes.array.isRequired,
  matchId: PropTypes.number.isRequired,
};

MatchSpoilers.propTypes = propTypes;

export default MatchSpoilers;
