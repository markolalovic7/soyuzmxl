import PropTypes from "prop-types";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  description: PropTypes.string.isRequired,
  periodScores: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
};
const defaultProps = {};

const MatchTeamScore = ({ description, periodScores, score }) => (
  <div className={classes["bet__score-row"]}>
    <span className={classes["bet__squad"]}>{description}</span>
    {periodScores.map((score, index) => (
      <span
        className={`${classes["bet__count"]} ${index === periodScores.length - 1 ? classes["bet__count_active"] : ""}`}
        key={index}
      >
        {score}
      </span>
    ))}
    <span className={classes["bet__count"]}>{score}</span>
  </div>
);

MatchTeamScore.propTypes = propTypes;
MatchTeamScore.defaultProps = defaultProps;

export default MatchTeamScore;
