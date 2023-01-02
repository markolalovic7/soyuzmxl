import MatchDropdownPanel from "applications/vanilladesktop/components/MatchDropdownPanel";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const MatchSpoilersSection = ({ eventId, markets }) => (
  <div className={classes["match-spoilers"]}>
    {markets.map((submarkets, index) => (
      <MatchDropdownPanel
        eventId
        isCompact
        autoExpand={index < 10}
        key={index}
        label={submarkets.length > 0 ? `${submarkets[0].desc} - ${submarkets[0].period}` : ""}
        markets={submarkets.map((market) => ({
          ...market,
          outcomes: [...Object.values(market.children).map((o) => ({ ...o, dir: o.priceDir }))],
        }))}
      />
    ))}
  </div>
);

const propTypes = {
  eventId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
};

const defaultProps = {};

MatchSpoilersSection.propTypes = propTypes;
MatchSpoilersSection.defaultProps = defaultProps;

export default MatchSpoilersSection;
