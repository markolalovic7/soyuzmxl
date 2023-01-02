import PropTypes from "prop-types";
import React from "react";

import MatchContainer from "../MatchContainer";
import OutrightContainer from "../OutrightContainer";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  activeEventId: PropTypes.number,
  events: PropTypes.array.isRequired,
  live: PropTypes.bool.isRequired,
  onToggleActiveEvent: PropTypes.func.isRequired,
  pathDescription: PropTypes.string.isRequired,
  virtual: PropTypes.string.isRequired,
};

const defaultProps = { activeEventId: undefined };

const LeagueContainer = ({ activeEventId, events, live, onToggleActiveEvent, pathDescription, virtual }) => (
  <>
    <div className={classes["bets__title"]}>{pathDescription}</div>
    {events &&
      events.map((match) => {
        if (match.eventType === "GAME") {
          return (
            <MatchContainer
              additionalMarketsExpanded={activeEventId === match.id}
              event={match}
              key={match.id}
              live={live}
              virtual={virtual}
              onToggleActiveEvent={onToggleActiveEvent}
            />
          );
        }

        return <OutrightContainer key={match.id} match={match} />;
      })}
  </>
);

LeagueContainer.propTypes = propTypes;
LeagueContainer.defaultProps = defaultProps;

export default React.memo(LeagueContainer);
