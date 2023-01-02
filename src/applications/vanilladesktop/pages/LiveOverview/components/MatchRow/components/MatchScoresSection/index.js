import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../scss/vanilladesktop.module.scss";

const propTypes = {
  aPeriodScores: PropTypes.array.isRequired,
  aScore: PropTypes.string,
  hPeriodScores: PropTypes.array.isRequired,
  hScore: PropTypes.string,
  opADesc: PropTypes.string.isRequired,
  opBDesc: PropTypes.string.isRequired,
};

const defaultProps = {
  aScore: undefined,
  hScore: undefined,
};

const MatchScoresSection = ({ aPeriodScores, aScore, hPeriodScores, hScore, opADesc, opBDesc }) => (
  <div className={classes["live-overview-item__matches"]}>
    <div className={classes["live-overview-item__match"]}>
      <span className={classes["live-overview-item__team"]}>{opADesc}</span>
      <div className={classes["live-overview-item__numbers"]}>
        {hPeriodScores.map((score, index) => (
          <span className={classes["live-overview-item__number"]} key={index}>
            {score}
          </span>
        ))}
        <span className={cx(classes["live-overview-item__number"], classes["live-overview-item__number_special"])}>
          {hScore}
        </span>
      </div>
    </div>
    <div className={classes["live-overview-item__match"]}>
      <span className={classes["live-overview-item__team"]}>{opBDesc}</span>
      <div className={classes["live-overview-item__numbers"]}>
        {aPeriodScores.map((score, index) => (
          <span className={classes["live-overview-item__number"]} key={index}>
            {score}
          </span>
        ))}
        <span className={cx(classes["live-overview-item__number"], classes["live-overview-item__number_special"])}>
          {aScore}
        </span>
      </div>
    </div>
  </div>
);

MatchScoresSection.propTypes = propTypes;
MatchScoresSection.defaultProps = defaultProps;

export default React.memo(MatchScoresSection);
