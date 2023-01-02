import PropTypes from "prop-types";
import React from "react";

import AsianMatchContainer from "../../../AsianMatchContainer";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  activeEventId: PropTypes.number,
  events: PropTypes.array.isRequired,
  onToggleActiveEvent: PropTypes.func.isRequired,
  pathDescription: PropTypes.string.isRequired,
};

const defaultProps = {
  activeEventId: undefined,
};

const LeagueContainer = ({ activeEventId, events, onToggleActiveEvent, pathDescription }) => (
  <>
    <div className={classes["bets__title"]}>{pathDescription}</div>
    {events &&
      events.map((match) => (
        <AsianMatchContainer
          additionalMarketsExpanded={activeEventId === match.id}
          event={match}
          key={match.id}
          live={false}
          markets={Object.values(match.children)}
          onToggleActiveEvent={() => onToggleActiveEvent(match.id)}
        />
      ))}
  </>
);

LeagueContainer.propTypes = propTypes;
LeagueContainer.defaultProps = defaultProps;

export default React.memo(LeagueContainer);
