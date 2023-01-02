import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import React, { useState } from "react";

const propTypes = {
  period: PropTypes.object.isRequired,
};
const defaultProps = {};

const MatchOutcomeResult = ({ period }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onExpandedClick = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  return (
    <>
      <div
        className={`${classes["flag__top"]} ${classes["spoiler-list"]} ${isExpanded ? classes["active"] : "none"}`}
        onClick={onExpandedClick}
      >
        <span
          className={`${classes["flag__arrow"]} ${classes["spoiler-arrow"]} ${isExpanded ? classes["active"] : "none"}`}
        />
        <span className={classes["flag__title"]}>{period.description}</span>
        <span className={classes["flag__score"]}>{period.score}</span>
      </div>
      <div className={`${classes["flag__body"]} ${isExpanded ? classes["open"] : ""}`}>
        <div className={classes["flag__element"]}>
          {period.players.map((player) => (
            <div
              className={`${classes["flag__coeficient"]} ${player.result === "WIN" ? classes["selected"] : ""}`}
              key={player.name}
            >
              <span className={classes["flag__confirm"]}>{player.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

MatchOutcomeResult.propTypes = propTypes;
MatchOutcomeResult.defaultProps = defaultProps;

export default React.memo(MatchOutcomeResult);
